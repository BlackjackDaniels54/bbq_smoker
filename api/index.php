<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

// Database connection
$host = 'localhost';
$db   = 'bbq_smoker';
$user = 'bbq_user';
$pass = '59tYL3zKyhCzsm1c';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$pdo = new PDO($dsn, $user, $pass);


$app->group('/BBQ-Smoker/api', function (Slim\Routing\RouteCollectorProxy $group) use ($pdo) 
{
    $group->post('/sendRequest', function (Request $request, Response $response, array $args) use ($pdo) {
        //var_dump($request->getBody()->getContents());
        //$data = $request->getParsedBody(); // отримуємо дані з тіла запиту
        $data = json_decode($request->getBody()->getContents(), true);
        $totalCost = 0;
        $message = "";
        // Дані замовлення
        $orderData = $data['order'];
        
        // Очищення вхідних даних
        $name = sanitizeInput($orderData['name']);
        $phone = sanitizeInput($orderData['phone']);
        $delivery = sanitizeInput($orderData['deliveryOption']);
        $address = sanitizeInput($orderData['address']);
        $comment = sanitizeInput($orderData['comment']);
        
        if (empty($name) || empty($phone)) {
            $response->getBody()->write(json_encode(['error' => 'Name and phone number are required']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

      // Перевірка типу доставки та адреси
        if (!in_array($delivery, ["delivery", "pickup"])) {
            $response->getBody()->write(json_encode(['error' => 'Invalid delivery option']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    
        if ($delivery == "delivery" && empty($address)) {
            $response->getBody()->write(json_encode(['error' => 'Address is required for delivery']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    
        if ($delivery == "pickup" && !empty($address)) {
            $response->getBody()->write(json_encode(['error' => 'Address should be empty for pickup']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    
        // Перевірка імені
        if (strlen($name) < 2 || strlen($name) > 15) {
            $response->getBody()->write(json_encode(['error' => 'Name should be between 2 and 15 characters']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    
        if (!preg_match("/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ]+$/u", $name)) {
            $response->getBody()->write(json_encode(['error' => 'Name should contain only letters']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }        
        
        if (!$data["cart"]) {
            $response->getBody()->write(json_encode(['error' => 'Invalid data']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
        
        foreach($data["cart"] as $productData) {
            // Шукаємо продукт в базі даних за ID
            $stmt = $pdo->prepare('SELECT * FROM Products WHERE id = :id');
            $stmt->execute(['id' => (int) $productData['product']['id']]);
            $product = $stmt->fetch();

            // Якщо продукт не знайдено або дані не відповідають, повертаємо помилку
            if (!$product) {
                $response->getBody()->write(json_encode(['error' => 'Invalid data']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
            
            $productCost = $product['price'] * (int) $productData['quantity'];
            $totalCost += $productCost;
    
            $message .= "🔹<b>{$product['name']}</b>{$product['sub_name']}:\n";
            $message .= "🔸🔸<b>Вартість:</b> ₴{$product['price']}\n";
            $message .= "🔸🔸<b>Кількість:</b> {$productData['quantity']}\n";
            $message .= "🔸🔸<b>Загальна вартість:</b> ₴{$productCost}\n"; 
            
        }
        
        
        
        $message .= "\n💰<b>Усього:</b> ₴{$totalCost}\n";
        if ($delivery == "delivery")
        {
            $status = "❌";    
            $addressStatus = "🔸<b>Адреса:</b> {$address}\n";
        } else {
            $status = "✅";
            $addressStatus = "";
        }
           
        $message_to_send = "🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵\n";
        $message_to_send .= "🔸<b>Нове замовлення!</b>\n";
        $message_to_send .= "🔸<b>Ім'я:</b> {$name}\n";
        $message_to_send .= "🔸<b>Телефон:</b> <code>{$phone}</code>\n";
        $message_to_send .= "🔸<b>Самовивіз:</b> {$status}\n";
        $message_to_send .= $addressStatus;
        $message_to_send .= "🔸<b>Повідомлення:</b> {$comment}\n";
        $message_to_send .= "🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡\n";
        $message_to_send .= $message;

        // Якщо дані збігаються, відправляємо повідомлення в Telegram через Bot API
        $client = new \GuzzleHttp\Client();
        $res = $client->post('https://api.telegram.org/bot6304428329:AAEgyRD2JY9eA1aw0LfHev91x06wTvCfuGw/sendMessage', [
            'form_params' => [
                'chat_id' => '-1001641848532',
                'parse_mode' => 'HTML',
                'text' => $message_to_send
            ]
        ]);
    
        if ($res->getStatusCode() != 200) {
            // Якщо повідомлення не відправлено, повертаємо помилку
            $response->getBody()->write(json_encode(['error' => 'Failed to send message']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
        // Якщо повідомлення відправлено, повертаємо успішну відповідь
        
        $response->getBody()->write(json_encode(['success' => true]));
        return $response->withHeader('Content-Type', 'application/json');
    }); 
    
    $group->get('/getProducts', function (Request $request, Response $response, $args) use ($pdo) {
        $stmt = $pdo->query('SELECT * FROM Products');
        $products = $stmt->fetchAll(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($products));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getProductById/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $stmt = $pdo->prepare('SELECT * FROM Products WHERE id=:id');
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($product));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getProductByName/{name}', function (Request $request, Response $response, array $args) use ($pdo) {
        $name = $args['name'];
        $stmt = $pdo->prepare('SELECT * FROM Products WHERE name=:name');
        $stmt->execute([':name' => $name]);
        $product = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($product));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getCategories', function (Request $request, Response $response, $args) use ($pdo) {
        $stmt = $pdo->query('SELECT * FROM Categories');
        $categories = $stmt->fetchAll(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($categories));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getCategoryById/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $stmt = $pdo->prepare('SELECT * FROM Categories WHERE id=:id');
        $stmt->execute([':id' => $id]);
        $category = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($category));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getCategoryByName/{name}', function (Request $request, Response $response, array $args) use ($pdo) {
        $name = $args['name'];
        $stmt = $pdo->prepare('SELECT * FROM Categories WHERE name=:name');
        $stmt->execute([':name' => $name]);
        $category = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($category));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getProductsByCategoryId/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $stmt = $pdo->prepare('SELECT * FROM Products WHERE category_id=:id');
        $stmt->execute([':id' => $id]);
        $products = $stmt->fetchAll(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($products));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getProductsByCategoryName/{name}', function (Request $request, Response $response, array $args) use ($pdo) {
        $name = $args['name'];
        $stmt = $pdo->prepare('SELECT p.* FROM Products p JOIN Categories c ON p.category_id = c.id WHERE c.name=:name');
        $stmt->execute([':name' => $name]);
        $products = $stmt->fetchAll(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($products));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getProductByCategoryId/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $stmt = $pdo->prepare('SELECT * FROM Products WHERE category_id=:id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($product));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getProductByCategoryName/{name}', function (Request $request, Response $response, array $args) use ($pdo) {
        $name = $args['name'];
        $stmt = $pdo->prepare('SELECT p.* FROM Products p JOIN Categories c ON p.category_id = c.id WHERE c.name=:name LIMIT 1');
        $stmt->execute([':name' => $name]);
        $product = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($product));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getCategoryByProductId/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $stmt = $pdo->prepare('SELECT c.* FROM Categories c JOIN Products p ON p.category_id = c.id WHERE p.id=:id');
        $stmt->execute([':id' => $id]);
        $category = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($category));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    $group->get('/getCategoryByProductName/{name}', function (Request $request, Response $response, array $args) use ($pdo) {
        $name = $args['name'];
        $stmt = $pdo->prepare('SELECT c.* FROM Categories c JOIN Products p ON p.category_id = c.id WHERE p.name=:name');
        $stmt->execute([':name' => $name]);
        $category = $stmt->fetch(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($category));
        return $response->withHeader('Content-Type', 'application/json');
    });
    
    
    // POST /products
    $group->post('/product', function (Request $request, Response $response, $args) use ($pdo) {
        $productData = $request->getParsedBody();
        $token = $request->getHeaderLine('Authorization');
        $token = substr($token, 7);
        
        // Check token in database
        $stmt = $pdo->prepare('SELECT * FROM Users WHERE token=:token');
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if ($user) {
            // Add product to database
            /*
            $stmt = $pdo->prepare('INSERT INTO Products (name, description, imageSrc, price, category_id) VALUES (:name, :description, :imageSrc, :price, :category_id)');
            $stmt->execute([
                ':name' => $productData['name'],
                ':description' => $productData['description'],
                ':imageSrc' => $productData['imageSrc'],
                ':price' => $productData['price'],
                ':category_id' => $productData['category_id']
            ]);
            */
            $response->getBody()->write('Product added successfully.');
        } else {
            $response->getBody()->write('Invalid token.');
            return $response->withStatus(401);
        }

        return $response;
    });

    // PUT /products/{id}
    $group->put('/product/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $productData = $request->getParsedBody();
        $token = $request->getHeaderLine('Authorization');

        // Check token in database
        $stmt = $pdo->prepare('SELECT * FROM Users WHERE token=:token');
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if ($user) {
            // Update product in database
            /*
            $stmt = $pdo->prepare('UPDATE Products SET name=:name, description=:description, imageSrc=:imageSrc, price=:price, WHERE id=:id');
            $stmt->execute([
                ':name' => $productData['name'],
                ':description' => $productData['description'],
                ':imageSrc' => $productData['imageSrc'],
                ':price' => $productData['price'],
                ':id' => $id
            ]);
            */
            $response->getBody()->write("Product {$id} updated successfully.");
        } else {
            $response->getBody()->write('Invalid token.');
            return $response->withStatus(401);
        }

        return $response;
    });

    // DELETE /products/{id}
    $group->delete('/product/{id}', function (Request $request, Response $response, array $args) use ($pdo) {
        $id = $args['id'];
        $token = $request->getHeaderLine('Authorization');

        // Check token in database
        $stmt = $pdo->prepare('SELECT * FROM Users WHERE token=:token');
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if ($user) {
            // Delete product from database
            /*
            $stmt = $pdo->prepare('DELETE FROM Products WHERE id=:id');
            $stmt->execute([':id' => $id]);
            */
            $response->getBody()->write("Product {$id} deleted successfully.");
        } else {
            $response->getBody()->write('Invalid token.');
            return $response->withStatus(401);
        }

        return $response;
    });    
});
$app->run();
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}
?>