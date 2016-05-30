<?php
        include('../conexion.php');
	session_start();
	
	 //If not isset -> set with dumy value so it doesn't complain unexpectedly echoing  HTML full of "Notice: Undefined index"
	if (!isset($_POST['gpos']))
	{$_POST['gpos'] = "";}
	
	$gpos=trim($_POST['gpos']);
	
	$xml_output = "<?xml version=\"1.0\"?>\n";
	
	$tipo_am=$_POST['tipo_am'];
	switch ($tipo_am) {
	
	case "chk":	
	$sql = "SELECT * FROM geolocalizacion ORDER BY gpos";
	     $resultID = @mysql_query($sql, $con);
		 $numfilas= @mysql_num_rows($resultID);
		    
			$xml_output .= "<positions>\n";
			
			for($x = 0 ; $x < @mysql_num_rows($resultID) ; $x++){
				$row = @mysql_fetch_assoc($resultID); 
				$xml_output .= "\t<coordinates>\n";				
				$xml_output .= "\t\t<lat>" . $row['latitud'] . "</lat>\n";
				$xml_output .= "\t\t<lng>" . $row['longitud'] . "</lng>\n";
				$xml_output .= "\t\t<gpos>" . $row['gpos'] . "</gpos>\n";
				$xml_output .= "\t</coordinates>\n";
			}
			
			$xml_output .= "</positions>";
		 break;
    case "rep":
$sql = "SELECT a.fecha, b.nombre_producto, sum(c.cantidad) as cuant FROM venta a, productos b, venta_productos c where a.NV=c.NV && b.PID=c.PID &&a.gpos = '$gpos'  ORDER BY a.fecha";
	     $resultID = @mysql_query($sql, $con);
		 $numfilas= @mysql_num_rows($resultID);
		    
			$xml_output .= "<ventas>\n";
			
			for($x = 0 ; $x < @mysql_num_rows($resultID) ; $x++){
				$row = @mysql_fetch_assoc($resultID); 
				$xml_output .= "\t<venta_dia>\n";				
				$xml_output .= "\t\t<dia>" . $row['fecha'] . "</dia>\n";
				$xml_output .= "\t\t<nombre_producto>" . $row['nombre_producto'] . "</nombre_producto>\n";
				$xml_output .= "\t\t<cantidad>" . $row['cuant'] . "</cantidad>\n";
				$xml_output .= "\t</venta_dia>\n";
			}
			
			$xml_output .= "</ventas>";

         break;
}
	   echo $xml_output; 	
	   
?> 
 