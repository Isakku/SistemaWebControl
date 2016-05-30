-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 18, 2012 at 01:18 AM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dbsyscontolweb`
--

-- --------------------------------------------------------

--
-- Table structure for table `geolocalizacion`
--

CREATE TABLE IF NOT EXISTS `geolocalizacion` (
  `gpos` int(12) NOT NULL AUTO_INCREMENT,
  `latitud` double NOT NULL,
  `longitud` double NOT NULL,
  `nombre_lugar` text,
  PRIMARY KEY (`gpos`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `geolocalizacion`
--

INSERT INTO `geolocalizacion` (`gpos`, `latitud`, `longitud`, `nombre_lugar`) VALUES
(3, -16.49901, -68.146248, 'Nataniel Aguirre, La Paz, Bolivia'),
(4, -16.49901, -68.146248, 'Nataniel Aguirre, La Paz, Bolivia');

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE IF NOT EXISTS `productos` (
  `PID` varchar(14) NOT NULL,
  `nombre_producto` varchar(75) NOT NULL,
  `empaque` varchar(75) NOT NULL,
  `unidades_tamaño` varchar(12) NOT NULL,
  `precio_unitario` float NOT NULL,
  `precio_venta` float NOT NULL,
  `NTP` int(12) NOT NULL,
  `NombreImagen` varchar(14) DEFAULT 'noThumb.gif',
  `status` char(7) NOT NULL DEFAULT 'OK',
  PRIMARY KEY (`PID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`PID`, `nombre_producto`, `empaque`, `unidades_tamaño`, `precio_unitario`, `precio_venta`, `NTP`, `NombreImagen`, `status`) VALUES
('F00510', 'CHICOLAC', 'BOLSA', '160 ML', 0.8, 1, 1, 'F00510.jpg', 'OK'),
('F01001', 'LECHE PIL NATURAL UHT', 'BOLSA', '946 ML', 4.35, 4.8, 2, 'F01001.jpg', 'OK'),
('F01003', 'LECHE PIL LIGHT UHT', 'BOLSA', '946 ML', 5.2, 5.7, 2, 'F01003.jpg', 'OK'),
('F01114', 'MILKYFRUT FRUTILLA', 'TETRACLASIC', '150 ML', 1.68, 2, 3, 'F01114.jpg', 'OK'),
('F02020', 'YOGURT BATIDITO FRUTILLA', 'VASO', '90 GR', 1.02, 1.2, 4, 'F02020.jpg', 'OK'),
('F02050', 'YOGUMON FRUTILLA', 'BOLSA', '80 ML', 0.38, 0.5, 4, 'F02050.jpg', 'OK'),
('F04510', 'PILFRUT MANZANA', 'BOLSA', '1 LT', 2.62, 3, 3, 'F04510.jpg', 'OK'),
('F04552', 'PILFRUT DURAZNO', 'BOLSA', '150 ML', 0.39, 0.5, 3, 'F04533.jpg', 'OK'),
('F100456', 'sdfsdf', 'dfvgbh', '1234kil', 12, 13, 3, 'noThumb.gif', 'OK');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_producto`
--

CREATE TABLE IF NOT EXISTS `tipo_producto` (
  `NTP` int(12) NOT NULL AUTO_INCREMENT,
  `Nombre_Tipo` varchar(75) NOT NULL,
  PRIMARY KEY (`NTP`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `tipo_producto`
--

INSERT INTO `tipo_producto` (`NTP`, `Nombre_Tipo`) VALUES
(1, 'Leches Pasteurizadas'),
(2, 'Leches UHT'),
(3, 'Jugos Lácteos'),
(4, 'Yogures');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `CI` varchar(12) NOT NULL,
  `nombre` varchar(70) DEFAULT NULL,
  `Apellido_P` varchar(70) DEFAULT NULL,
  `Apellido_M` varchar(70) DEFAULT NULL,
  `pass` varchar(255) NOT NULL,
  `tipo_usuario` char(14) NOT NULL,
  `status` char(7) NOT NULL,
  PRIMARY KEY (`CI`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`CI`, `nombre`, `Apellido_P`, `Apellido_M`, `pass`, `tipo_usuario`, `status`) VALUES
('00000001', 'Administrador', NULL, NULL, 'ADMIN', 'Administrador', 'OK'),
('1234567', 'juan', 'perez', 'perez', 'juanperezperez', 'Normal', 'DWN'),
('56789087', 'juan', 'perez', 'perez', 'jjperez', 'Normal', 'OK');

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE IF NOT EXISTS `venta` (
  `NV` int(11) NOT NULL AUTO_INCREMENT,
  `CI` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `gpos` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  PRIMARY KEY (`NV`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
