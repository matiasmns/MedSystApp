<?php
ob_start(); // Inicia el buffer de salida

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';
include 'pacientes.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($conn);
            break;
        case 'POST':
            handlePost($conn);
            break;
        case 'PUT':
            handlePut($conn);
            break;
        case 'DELETE':        
            handleDelete($conn);
            break;
        default:
            echo json_encode(['message' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['message' => 'Error del servidor', 'error' => $e->getMessage()]);
    http_response_code(500);
}

ob_end_flush(); // Envía el buffer de salida y desactiva el almacenamiento en el buffer

// Este método me devuelve un paciente o todos los pacientes
function handleGet($conn) 
{
    ob_clean(); // Limpia el buffer de salida antes de enviar la respuesta JSON
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id > 0) 
    {
        $stmt = $conn->prepare("SELECT * FROM pacientes WHERE id = ?");
        $stmt->execute([$id]);
        $paciente = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($paciente) 
        {
            $pacienteObj = Pacientes::fromArray($paciente);
            echo json_encode($pacienteObj->toArray());
        } 
        else 
        {
            http_response_code(404);
            echo json_encode(['message' => 'No se encontraron datos']);
        }
    } 
    else 
    {
        $stmt = $conn->query("SELECT * FROM pacientes");
        $pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $pacienteObjs = array_map(fn($paciente) => Pacientes::fromArray($paciente)->toArray(), $pacientes);
        echo json_encode(['pacientes' => $pacienteObjs]);
    }
}

// Este método es para ingresar pacientes
function handlePost($conn) 
{
    ob_clean();
    if ($conn === null) 
    {
        echo json_encode(['message' => 'Error en la conexión a la base de datos']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $requiredFields = ['nombre', 'dni', 'idpaciente'];
    foreach ($requiredFields as $field) 
    {
        if (!isset($data[$field])) 
        {
            echo json_encode(['message' => 'Datos del paciente incompletos']);
            return;
        }
    }

    $paciente = Pacientes::fromArray($data);

    try 
    {
        $stmt = $conn->prepare("INSERT INTO pacientes (nombre, dni, idpaciente) VALUES (?, ?, ?)");
        $stmt->execute([
            $paciente->nombre,
            $paciente->dni,
            $paciente->idpaciente
        ]);

        echo json_encode(['message' => 'Paciente ingresado correctamente']);
    } 
    catch (PDOException $e) 
    {
        echo json_encode(['message' => 'Error al ingresar el paciente', 'error' => $e->getMessage()]);
    }
}

function handlePut($conn) 
{
    ob_clean();
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id > 0) 
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $paciente = Pacientes::fromArray($data);
        $paciente->id = $id;

        $fields = [];
        $params = [];

        if ($paciente->nombre !== null) {
            $fields[] = 'nombre = ?';
            $params[] = $paciente->nombre;
        }
        if ($paciente->dni !== null) {
            $fields[] = 'dni = ?';
            $params[] = $paciente->dni;
        }
        if ($paciente->idpaciente !== null) {
            $fields[] = 'idpaciente = ?';
            $params[] = $paciente->idpaciente;
        }

        if (!empty($fields)) 
        {
            $params[] = $id;
            $stmt = $conn->prepare("UPDATE pacientes SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($params);
            echo json_encode(['message' => 'Paciente actualizado con éxito']);
        } 
        else 
        {
            echo json_encode(['message' => 'No hay campos para actualizar']);
        }
    } 
    else 
    {
        echo json_encode(['message' => 'ID no proporcionado']);
    }
}

// Método para borrar registros
function handleDelete($conn) 
{
    ob_clean();
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id > 0) 
    {
        $stmt = $conn->prepare("DELETE FROM pacientes WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Paciente eliminado con éxito']);
    } 
    else 
    {
        echo json_encode(['message' => 'ID no proporcionado']);
    }
}
?>
