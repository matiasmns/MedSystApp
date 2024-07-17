Valida Inicio de sesion
<?php
class pacientes
{
    public $id;
    public $nombre;
    public $dni;
    public $idpaciente;


    public function __construct($nombre,$dni=null,$idpaciente=null,$id=null)
    {
      $this->id=$id;  
      $this->nombre=$nombre;  
      $this->dni=$dni; 
      $this->idpaciente=$idpaciente; 
 
    }

    public static function fromArray($data)
    {
        return new self
        (
            $data['nombre'] ?? null,
            $data['dni'] ?? null,
            $data['idpaciente'] ?? null,
            $data['id'] ?? null,
        );






    }

    public function toArray()
    {
        return get_object_vars($this);
    }




}

?>