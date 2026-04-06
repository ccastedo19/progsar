-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-04-2026 a las 22:02:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `progsar`
--
CREATE DATABASE IF NOT EXISTS `progsar` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `progsar`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `imagen`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Máquina de Soldadura', 'Máquina de soldar o Soldadura en Santa Cruz, Bolivia', 'categorias/xwL0HcUZvDxOdDwB4nGrsj0TrN14A9WmcWHQAEZF.png', 1, '2026-03-06 03:53:12', '2026-03-06 03:54:03'),
(2, 'Motobombas', 'Motobombas de alta eficiencia para riego, drenaje y abastecimiento de agua. Equipos confiables para trabajo agrícola y construcción en Bolivia.', 'categorias/JO4EAOdBEjtQb1jxo2NEywlqPOcj6jOyP5ggRihp.jpg', 1, '2026-03-10 19:01:12', '2026-03-10 19:01:12'),
(3, 'Generador a gasolina', 'Generadores a gasolina potentes y eficientes para hogar y negocio. Arranque fácil y gran rendimiento. Envíos a todo Bolivia.', 'categorias/ZdvHfzoy0L8uSMdLceJaayBaNIwxqSX11nEgg4hE.jpg', 1, '2026-03-13 00:48:17', '2026-03-13 00:49:44'),
(4, 'Generador a diesel', 'Grupos electrógenos diésel industriales para empresas y proyectos exigentes. Alta potencia y eficiencia. Envíos a todo Bolivia, disponibles en Santa Cruz.', 'categorias/Svf2pIThP5PwWK5NcCADNbutGN46kIYGdzx5Nka0.png', 1, '2026-03-13 00:50:44', '2026-03-13 01:10:31'),
(5, 'Guinche eléctrico', 'Guinches eléctricos de alto rendimiento para elevar y mover carga con seguridad. Ideales para obra y trabajo pesado. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/0DYVK54fDLhsmiS8a4XcluiyT90X5hvQIlIlZPCC.jpg', 1, '2026-03-13 00:51:31', '2026-03-13 01:10:48'),
(6, 'Motocultor a gasolina', 'Motocultores a gasolina ideales para preparar tierra y labores agrícolas. Potencia, resistencia y rendimiento. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/dmO4yeU4uOf4nMzKB887fXWGCWIfuUh7Evv3WnVF.jpg', 1, '2026-03-13 00:53:48', '2026-03-13 01:11:12'),
(7, 'Motocultor a diesel', 'Motocultores diésel robustos para preparar tierra y labores agrícolas exigentes. Potencia y eficiencia. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/6Gzyg2dGIVxGc7mhXKxL1SjXqoJcu6Ckcsp3ploQ.jpg', 1, '2026-03-13 00:54:11', '2026-03-13 01:12:54'),
(8, 'Dinamo', 'Dinamos y alternadores eléctricos de alta eficiencia para generación de energía y maquinaria. Rendimiento confiable. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/fydeEEmyuU837NKbaFm9E5zr2ZInsR1Ps1B1kMLp.jpg', 1, '2026-03-13 00:58:12', '2026-03-13 01:26:17'),
(9, 'Balanza digital', 'Balanzas digitales de alta precisión para negocios, tiendas y control de peso. Calidad y exactitud garantizada. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/vaaga7dTzhIfpO8ACZaBxCeHYg7Fk6EPVjfFNm4c.jpg', 1, '2026-03-13 00:58:44', '2026-03-13 01:30:26'),
(10, 'Bomba de agua campana', 'Bombas de agua de campana para pozos y sistemas de abastecimiento. Alta durabilidad y rendimiento. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/qbqt3kKxzQ1b8zr2lNcNo7o734lia9cxl1EJfdl1.png', 1, '2026-03-13 01:04:02', '2026-03-13 01:28:58'),
(11, 'Bomba de agua lapiz', 'Bombas de agua tipo lápiz ideales para pozos profundos y uso agrícola o doméstico. Gran rendimiento y durabilidad. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/WpF1K4NGa7eCKJkMwRiClefNACSY5GI5x6Dgbw50.jpg', 1, '2026-03-13 01:06:08', '2026-03-13 01:31:43'),
(12, 'Mangueras', 'Mangueras de succión, lona y descarga para sistemas de agua, riego y bombeo. Resistentes y eficientes. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/nDr8O9FMmGSCieERt071uS39BaZXZ9tJbVwoNVWG.jpg', 1, '2026-03-13 01:28:29', '2026-03-13 01:28:29'),
(13, 'Motor estacionario a gasolina', 'Motores estacionarios a gasolina de alto rendimiento para uso agrícola e industrial. Potentes y duraderos. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/NXIJB5phFC1vVrMPonuu8mVmz4U5gli3eloVyyxZ.jpg', 1, '2026-03-13 01:29:45', '2026-03-13 01:29:45'),
(14, 'Motor estacionario a diesel', 'Motores estacionarios diésel robustos para trabajo agrícola e industrial. Alta eficiencia y larga vida útil. Envíos a todo Bolivia desde Santa Cruz.', 'categorias/EDJ2vtJJmi37Lv5JiYhc4N2sLeJksmblSB79kiX0.jpg', 1, '2026-03-13 01:31:07', '2026-03-13 01:31:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` bigint(20) UNSIGNED NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Apellido` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) NOT NULL,
  `ci` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `b2b` tinyint(4) NOT NULL DEFAULT 0,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `Nombre`, `Apellido`, `telefono`, `ci`, `estado`, `b2b`, `id_usuario`, `created_at`, `updated_at`) VALUES
(1, 'Clientes', 'Varios', '000000000', NULL, 1, 0, 1, '2026-02-28 00:17:05', '2026-03-10 19:29:29'),
(2, 'Comercial Boqueron Home Center SRL', NULL, '00000000', '486625028', 1, 0, 1, '2026-03-10 20:18:20', '2026-03-10 20:18:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizaciones`
--

CREATE TABLE `cotizaciones` (
  `id_cotizacion` bigint(20) UNSIGNED NOT NULL,
  `numero` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `fecha_vigencia` date DEFAULT NULL,
  `facturado_estado` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `porcentaje_factura` decimal(12,2) NOT NULL DEFAULT 0.00,
  `delivery` decimal(12,2) NOT NULL DEFAULT 0.00,
  `id_cliente` bigint(20) UNSIGNED NOT NULL,
  `total_sin_factura` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_con_factura` decimal(12,2) NOT NULL DEFAULT 0.00,
  `estado` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cotizaciones`
--

INSERT INTO `cotizaciones` (`id_cotizacion`, `numero`, `fecha`, `fecha_vigencia`, `facturado_estado`, `porcentaje_factura`, `delivery`, `id_cliente`, `total_sin_factura`, `total_con_factura`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-03-10', '2026-03-20', 0, 0.00, 0.00, 1, 1750.00, 1750.00, 1, '2026-03-10 19:54:36', '2026-03-10 19:54:36'),
(2, 2, '2026-03-10', '2026-03-20', 0, 0.00, 0.00, 2, 27200.00, 27200.00, 1, '2026-03-10 20:23:17', '2026-03-10 20:23:17'),
(3, 3, '2026-03-12', '2026-03-20', 1, 10.00, 0.00, 1, 1750.00, 1925.00, 1, '2026-03-12 19:41:02', '2026-03-12 19:41:02'),
(4, 4, '2026-04-01', '2026-04-10', 0, 0.00, 0.00, 1, 7650.00, 7650.00, 1, '2026-04-01 22:36:57', '2026-04-01 22:36:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizaciones_detalles`
--

CREATE TABLE `cotizaciones_detalles` (
  `id_cotizacion_detalle` bigint(20) UNSIGNED NOT NULL,
  `id_cotizacion` bigint(20) UNSIGNED NOT NULL,
  `id_producto` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(100) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `descuento` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_producto` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cotizaciones_detalles`
--

INSERT INTO `cotizaciones_detalles` (`id_cotizacion_detalle`, `id_cotizacion`, `id_producto`, `codigo`, `nombre_producto`, `precio_unitario`, `cantidad`, `descuento`, `total_producto`, `created_at`, `updated_at`) VALUES
(16, 1, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1, 0.00, 1750.00, '2026-03-10 19:54:36', '2026-03-10 19:54:36'),
(17, 2, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 17, 150.00, 27200.00, '2026-03-10 20:23:17', '2026-03-10 20:23:17'),
(18, 3, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1, 0.00, 1750.00, '2026-03-12 19:41:02', '2026-03-12 19:41:02'),
(19, 4, 6, 'SHZ7500G', 'Generador eléctrico 6500W 15HP', 7650.00, 1, 0.00, 7650.00, '2026-04-01 22:36:57', '2026-04-01 22:36:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ficha_tecnica`
--

CREATE TABLE `ficha_tecnica` (
  `id_ficha_tecnica` bigint(20) UNSIGNED NOT NULL,
  `id_producto` bigint(20) UNSIGNED NOT NULL,
  `caracteristica` varchar(150) NOT NULL,
  `especificacion` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ficha_tecnica`
--

INSERT INTO `ficha_tecnica` (`id_ficha_tecnica`, `id_producto`, `caracteristica`, `especificacion`, `created_at`, `updated_at`) VALUES
(14, 1, 'Amperaje', '300A', '2026-03-10 16:59:53', '2026-03-10 16:59:53'),
(15, 1, 'Maletin', 'Pinza porta-electrodo', '2026-03-10 16:59:53', '2026-03-10 16:59:53'),
(16, 1, 'Maletin', 'Pinza de tierra', '2026-03-10 16:59:53', '2026-03-10 16:59:53'),
(17, 1, 'Maletin', 'Cables de conexión', '2026-03-10 16:59:53', '2026-03-10 16:59:53'),
(18, 1, 'Maletin', 'Manual de usuario', '2026-03-10 16:59:53', '2026-03-10 16:59:53'),
(26, 2, 'Pulgadas', '2', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(27, 2, 'Modelo del motor', '170F', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(28, 2, 'Potencia Máxima', '4.0KW (5.5HP)', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(29, 2, 'Diametro de admision y descarga:', '2\" (50MM)', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(30, 2, 'Caudal Máximo', '533 Lts/Min', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(31, 2, 'Velocidad de rotación', '3600r/min', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(32, 2, 'Autosucción nominal', '7m', '2026-03-10 20:22:46', '2026-03-10 20:22:46'),
(33, 3, 'Capacidad', '200/400kg', '2026-03-13 02:08:20', '2026-03-13 02:08:20'),
(34, 3, 'Longitud cadena', '6/12m', '2026-03-13 02:08:20', '2026-03-13 02:08:20'),
(35, 3, 'Voltaje', '220V', '2026-03-13 02:08:20', '2026-03-13 02:08:20'),
(36, 3, 'Potencia', '1200W', '2026-03-13 02:08:20', '2026-03-13 02:08:20'),
(37, 3, 'Peso', '17Kg', '2026-03-13 02:08:20', '2026-03-13 02:08:20'),
(38, 4, 'Capacidad', '200/600kg', '2026-03-13 02:12:00', '2026-03-13 02:12:00'),
(39, 4, 'Longitud cadena', '18m', '2026-03-13 02:12:00', '2026-03-13 02:12:00'),
(40, 4, 'Voltaje', '220V', '2026-03-13 02:12:00', '2026-03-13 02:12:00'),
(41, 4, 'Potencia', '900W', '2026-03-13 02:12:00', '2026-03-13 02:12:00'),
(62, 5, 'Industria', 'Brasilera', '2026-03-13 23:56:42', '2026-03-13 23:56:42'),
(63, 5, 'Capacidad', '600/1200kg', '2026-03-13 23:56:42', '2026-03-13 23:56:42'),
(64, 5, 'Longitud de cadena', '6-12m', '2026-03-13 23:56:42', '2026-03-13 23:56:42'),
(65, 5, 'Velocidad', '8/4m/min', '2026-03-13 23:56:42', '2026-03-13 23:56:42'),
(66, 5, 'Potencia', '1800W', '2026-03-13 23:56:42', '2026-03-13 23:56:42'),
(67, 6, 'MODELO', 'SHZ7500G', '2026-04-01 22:36:10', '2026-04-01 22:36:10'),
(68, 6, 'POTENCIA', '6500W', '2026-04-01 22:36:10', '2026-04-01 22:36:10'),
(69, 6, 'VOLTAJE', '220V', '2026-04-01 22:36:10', '2026-04-01 22:36:10'),
(70, 6, 'FRECUENCIA', '50HZ', '2026-04-01 22:36:10', '2026-04-01 22:36:10'),
(71, 6, 'INDUSTRIA', 'BRASILERA', '2026-04-01 22:36:10', '2026-04-01 22:36:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `id_marca` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`id_marca`, `nombre`, `descripcion`, `imagen`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'LUTIAN', 'Lutian Tecnologia Japonesa de primera calidad, usada en Santa Cruz, Bolivia', 'marcas/ilFVhBRim0E5rL7FnMFp0DYzThOBFX5SiIvAAxNf.png', 1, '2026-03-06 17:03:34', '2026-03-06 17:05:02'),
(2, 'Mastermaq', 'MASTERMAQ es una marca brasileña de maquinaria y equipos industriales, especializada en soldadura y comercializada en Bolivia.', 'marcas/MjDXC356jbzp5qQg8xW0bmqb9qWLrujAHVXRhr7E.jpg', 1, '2026-03-10 04:47:34', '2026-03-10 04:47:50'),
(3, 'Worktools', 'Herramientas industriales profesionales de alto rendimiento. Equipos de potencia y precisión para talleres especializados y construcción. Diseñadas para ofrecer durabilidad y eficiencia en trabajos exigentes.', 'marcas/ETbMHIv46GY8NK617cFePwRZO7GAtH4BxrTbTCtX.jpg', 1, '2026-03-10 04:54:56', '2026-03-10 04:54:56'),
(4, 'Thoyoba', 'THOYOBA es una marca de maquinaria y equipos industriales fabricados en Brasil, orientados a talleres, construcción y agricultura, destacando por su potencia, precisión y durabilidad en trabajos exigentes.', 'marcas/cOow0jg3dtzJDCzrU2vxsUnYiwIUSvdkn7oXdEDb.jpg', 1, '2026-03-10 04:56:14', '2026-03-10 04:57:04'),
(5, 'Toyaki', 'TOYAKI es una marca de maquinaria, herramientas y equipos industriales para talleres, construcción y uso profesional.', 'marcas/vDsKCnuy6KUr15GiEi5ypBRgzmQ24wC0f9fuHty9.jpg', 1, '2026-03-10 04:59:09', '2026-03-10 04:59:09'),
(6, 'Total', 'TOTAL es una marca internacional de herramientas y equipos para construcción, talleres e industria, reconocida por su calidad, rendimiento y precios competitivos.', 'marcas/PwkwISTNeah9bdVbkw5DQsPqk07Eq5RqnDWjyGMb.png', 1, '2026-03-10 05:00:10', '2026-03-10 05:00:10'),
(7, 'Sthulztec', 'STHULZTEC es una marca de maquinaria y equipos industriales fabricados en Brasil, orientados a talleres, construcción y uso profesional.', 'marcas/bkXRGfiBKDHhlfIhtpAAeT6J6tzYW47OJe00OZF6.jpg', 1, '2026-03-10 05:01:22', '2026-03-10 05:01:22'),
(8, 'Bambozzi', 'BAMBOZZI es una marca de equipos industriales especializada en tecnología de soldadura, reconocida por su calidad, innovación y durabilidad en aplicaciones profesionales.', 'marcas/gfkmqPSpHDv3XQtRr9inMdslypVmwL536l4RPACq.jpg', 1, '2026-03-10 05:02:39', '2026-03-10 05:02:39'),
(9, 'Katari', 'KATARI es una marca china especializada en generadores, motocultores y maquinaria para uso agrícola e industrial, destacando por su potencia y eficiencia.', 'marcas/BP7x59eOjvpUy54E4b239O16H618uZX8TVgUxUEN.jpg', 1, '2026-03-10 05:04:06', '2026-03-10 05:04:06'),
(10, 'Toshiota', 'TOSHIOTA es una marca de maquinaria y equipos industriales orientados a construcción, talleres y uso profesional, destacando por su rendimiento y durabilidad.', 'marcas/0tVF4xyC8v9LHXspvDbxQUDGxdKLbQJzcA0AByJi.png', 1, '2026-03-10 05:05:19', '2026-03-10 05:05:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2026_02_09_042429_create_roles_table', 1),
(3, '2026_02_09_042436_create_usuarios_table', 1),
(4, '2026_02_09_051346_add_username_imagen_to_usuarios_table', 2),
(5, '2026_03_05_225456_create_categorias_table', 3),
(6, '2026_03_05_225456_create_categoriass_table', 4),
(7, '2026_03_06_124751_create_marcas_table', 5),
(8, '2026_03_06_131724_create_proveedors_table', 6),
(9, '2026_03_06_150458_create_productos_table', 7),
(10, '2026_03_06_150504_create_ficha_tecnicas_table', 8),
(11, '2026_03_09_174018_create_cotizaciones_table', 9),
(12, '2026_03_09_174038_create_cotizaciones_detalles_table', 10),
(13, '2026_03_09_232444_create_ventas_table', 11),
(14, '2026_03_09_232512_create_ventas_detalles_table', 12),
(15, '2026_03_09_232512_createe_ventas_detalles_table', 13),
(16, '2026_03_09_232444_createe_ventas_table', 14),
(17, '2026_03_09_232512_createee_ventas_detalles_table', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Usuario', 1, 'web', '2d9f0b5b1abbb94d638a3c1cea53ceb2e8866119029d13175db240fad9e84d28', '[\"*\"]', NULL, NULL, '2026-02-09 08:46:57', '2026-02-09 08:46:57'),
(4, 'App\\Models\\Usuario', 1, 'web', '71e00540ab647db58e8aee401155f821bc762bc39916d7ff61f9f8401a443765', '[\"*\"]', NULL, NULL, '2026-02-09 20:17:49', '2026-02-09 20:17:49'),
(5, 'App\\Models\\Usuario', 1, 'web', '57631e37d92f1ba43c8a29812029d0af460acf01a53c39b0b899ec3b963e6eb5', '[\"*\"]', NULL, NULL, '2026-02-09 20:18:27', '2026-02-09 20:18:27'),
(8, 'App\\Models\\Usuario', 1, 'web', 'ce03b83dd194ba583a7937e304bd0538a9a1228b255401e82f3bb366822deffd', '[\"*\"]', '2026-03-10 02:08:53', NULL, '2026-03-09 23:04:00', '2026-03-10 02:08:53'),
(10, 'App\\Models\\Usuario', 1, 'web', '9c0c3aaa4eee8dbd33621ebd506b0a14a4faf62f87757dda75d5a999d37ce44c', '[\"*\"]', '2026-03-18 01:54:58', NULL, '2026-03-10 04:31:48', '2026-03-18 01:54:58'),
(11, 'App\\Models\\Usuario', 1, 'web', 'e3fb59eb4b70be9dcc83cf98b34ceeeba0157770d3623c434bab062ca908592a', '[\"*\"]', '2026-04-01 22:58:52', NULL, '2026-03-10 16:58:50', '2026-04-01 22:58:52'),
(12, 'App\\Models\\Usuario', 1, 'web', 'b57c3a0372e567ef26ac5ade4dfbbf6e08c972ff5e69f5d72c96280c89a292ba', '[\"*\"]', '2026-03-14 00:22:11', NULL, '2026-03-13 07:35:46', '2026-03-14 00:22:11'),
(13, 'App\\Models\\Usuario', 1, 'web', 'b8099f5a864fac16973da6d1a05578198245ae6d8c3f0c61b2db7c5d0c69df43', '[\"*\"]', NULL, NULL, '2026-03-13 17:18:41', '2026-03-13 17:18:41'),
(14, 'App\\Models\\Usuario', 1, 'web', 'b96619d3180a944f80372913339edd8938ede60c93a3f34328035166d3f80312', '[\"*\"]', NULL, NULL, '2026-03-13 17:18:41', '2026-03-13 17:18:41'),
(15, 'App\\Models\\Usuario', 1, 'web', 'c2a5f7a23dacef745f263d5bc401c2d4639c5340cfafcba092a2c00b1b89f503', '[\"*\"]', '2026-03-13 17:26:07', NULL, '2026-03-13 17:18:41', '2026-03-13 17:26:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(1000) NOT NULL,
  `codigo` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `imagen_1` varchar(500) NOT NULL,
  `imagen_2` varchar(500) DEFAULT NULL,
  `imagen_3` varchar(500) DEFAULT NULL,
  `id_categoria` bigint(20) UNSIGNED NOT NULL,
  `id_marca` bigint(20) UNSIGNED NOT NULL,
  `id_proveedor` bigint(20) UNSIGNED NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `url_amigable` varchar(200) DEFAULT NULL,
  `meta_titulo` varchar(255) DEFAULT NULL,
  `meta_descripcion` varchar(500) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `codigo`, `stock`, `imagen_1`, `imagen_2`, `imagen_3`, `id_categoria`, `id_marca`, `id_proveedor`, `precio_venta`, `precio_compra`, `url_amigable`, `meta_titulo`, `meta_descripcion`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Máquina de soldar 300A', 'Máquina de soldar 300A para uso domestico', 'HM-300A', 4, 'productos/dL51BYz0RjsELPgRsRrwvc5G7wIlOtrZWygNbJhP.png', 'productos/KNW0f6bMix3RYgXaNR2eJzZ2lAoJCDkWVOiS0Emx.jpg', 'productos/xWnIZOEGboiL5eCtQ3h64UOrPMR0RKppvyGjNm18.jpg', 1, 2, 1, 550.00, 432.00, 'maquina-de-soldar-300a', 'Màquina de Soldar 300A Bolivia', 'Máquina de soldar 300A para uso domestico', 1, '2026-03-07 00:52:26', '2026-03-11 23:05:53'),
(2, 'Motobomba de 2 Pulgadas', 'Motobomba Toshiota TOPW50 a gasolina de 2”, equipada con motor 170F de 4.0 kW y 3600 rpm, diseñada para bombeo eficiente de agua en riego, drenaje y construcción. Ofrece 32 m³/h de caudal y autosucción de 7 m, ideal para trabajos exigentes en Bolivia.', 'TOWP50', 21, 'productos/4YHvD10aJG1oSFqIqmpjdbAhfj9gT8ODaDlsrxUc.png', NULL, NULL, 2, 10, 1, 1750.00, 1195.00, 'motobomba-de-2-pulgadas', NULL, NULL, 1, '2026-03-10 19:25:35', '2026-03-11 23:50:04'),
(3, 'Guinche eléctrico de 400Kg', 'Guinche eléctrico de 400 kg ideal para levantar y mover cargas en talleres, construcción y almacenes. Motor potente, estructura resistente y sistema seguro para trabajo continuo. Fácil instalación y operación. Perfecto para elevar materiales con eficiencia.', 'TK-TE400', 0, 'productos/stCdmZTztr886GeWe5F2rkLqWN3NdvMOC2rFYX2A.jpg', 'productos/JTNz9I06rqtR8KCqgezh2ki8JQW0nEKJ6fewqrw0.png', NULL, 5, 5, 2, 1700.00, 1330.00, 'guinche-electrico-400kg', 'Guinche eléctrico de 400Kg', 'Guinche eléctrico de 400 kg ideal para levantar y mover cargas en talleres, construcción y almacenes. Motor potente, estructura resistente y sistema seguro para trabajo continuo. Fácil instalación y operación. Perfecto para elevar materiales con eficiencia.', 1, '2026-03-13 02:08:20', '2026-03-13 02:08:20'),
(4, 'Guinche eléctrico de 600Kg', 'Guinche eléctrico de 600 kg marca Total, ideal para levantar y mover cargas en talleres, construcción y almacenes. Motor potente, estructura resistente y sistema de seguridad para trabajo continuo. Fácil instalación y operación eficiente para elevar materiales. Envíos a todo Bolivia desde Santa Cruz', 'TLH1952', 5, 'productos/uH3sXVbwv0xZmlHA1Za06VpeQhEJkCWCKMVfVcLO.jpg', 'productos/Y194Ok31OkFb1PE9yNswjMA9EsjAZl3vCsaB9Anu.png', NULL, 5, 6, 2, 1950.00, 1615.00, 'Guinche-electrico-de-600Kg', 'Guinche eléctrico de 600Kg', 'Guinche eléctrico de 600 kg marca Total, ideal para levantar y mover cargas en talleres, construcción y almacenes. Motor potente, estructura resistente y sistema de seguridad para trabajo continuo. Fácil instalación y operación eficiente para elevar materiales. Envíos a todo Bolivia desde Santa Cruz', 1, '2026-03-13 02:12:00', '2026-03-13 02:12:00'),
(5, 'Guinche eléctrico de 1200Kg', '<p>Guinche eléctrico de 1200 kg ideal para levantar y mover cargas pesadas en construcción, talleres y almacenes. Motor de alta potencia, estructura reforzada y sistema de seguridad para trabajo continuo. Diseñado para ofrecer fuerza, estabilidad y rendimiento. Envíos a todo Bolivia desde Santa Cruz.</p>', 'TBTE1200', 3, 'productos/eF6I8227FQrDcIrkYFMJhNBcBxJJuiloYUOxVY4a.jpg', 'productos/1CXoQv7PvNRUD4GeAy588wEnwZ0sOZQ4wkWQ5PVJ.png', NULL, 5, 4, 2, 3500.00, 2850.00, 'guinche-electrico-de-1200kg', 'Guinche eléctrico de 1200Kg', 'Guinche eléctrico de 1200 kg ideal para levantar y mover cargas pesadas en construcción, talleres y almacenes. Motor de alta potencia, estructura reforzada y sistema de seguridad para trabajo continuo. Diseñado para ofrecer fuerza, estabilidad y rendimiento. Envíos a todo Bolivia desde Santa Cruz.', 1, '2026-03-13 02:16:47', '2026-03-13 23:56:42'),
(6, 'Generador eléctrico 6500W 15HP', '<p>Generador de luz a gasolina de 6500W Sthulztec, modelo SHZ7500G, ideal para uso residencial, comercial e industrial en Santa Cruz y Bolivia. Ofrece voltaje de 220V y frecuencia de 50Hz, garantizando suministro eléctrico confiable en cortes de energía o trabajos en zonas sin acceso a red eléctrica.</p>', 'SHZ7500G', 5, 'productos/tjB5GwzMAeanjpYbFMj6NDG1LML5ZY0nrNHueNOO.png', NULL, NULL, 3, 7, 5, 7650.00, 6696.00, 'generador-electrico-6500w-15hp', 'Generador eléctrico 6500W 15HP', 'Generador de luz a gasolina de 6500W Sthulztec, modelo SHZ7500G, ideal para uso residencial, comercial e industrial en Santa Cruz y Bolivia. Ofrece voltaje de 220V y frecuencia de 50Hz, garantizando suministro eléctrico confiable en cortes de energía o trabajos en zonas sin acceso a red eléctrica.', 1, '2026-04-01 22:36:10', '2026-04-01 22:36:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` bigint(20) UNSIGNED NOT NULL,
  `nit` varchar(50) DEFAULT NULL,
  `empresa` varchar(150) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nit`, `empresa`, `telefono`, `ciudad`, `direccion`, `estado`, `created_at`, `updated_at`) VALUES
(1, '03719913013', 'Ximcruz', '3599740', 'Santa Cruz', 'Av. doble vía la guardia, 6to anillo', 1, '2026-03-06 18:43:16', '2026-03-06 18:46:23'),
(2, '0000000000', 'Todomaq', '70445362', 'Santa Cruz', 'Cap. Manuel J. Montenegro 3000', 1, '2026-03-13 01:55:47', '2026-03-13 01:58:25'),
(3, '000000000000', 'Waldo', '70856737', 'Santa Cruz', 'Los Pozos', 1, '2026-03-13 01:56:59', '2026-03-13 01:56:59'),
(4, '0000000000', 'Vargas Pozos', '77609357', 'Santa Cruz', 'Los Pozos', 1, '2026-03-13 01:57:28', '2026-03-13 01:57:28'),
(5, '0000000000', 'Abelco', '73111888', 'Santa Cruz', 'Av Virgen De Cotoca, Santa Cruz de la Sierra', 1, '2026-03-13 01:58:14', '2026-03-13 01:58:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', NULL, NULL),
(2, 'Administrador', NULL, NULL),
(3, 'Vendedor', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `telefono`, `imagen`, `email`, `username`, `password`, `id_rol`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Cesar', 'Castedo', '76000898', 'usuarios/ZnSuFWtkLbjreD3Y17uz8rzkVEn7LZeBGsgP0nfw.jpg', 'cesar.castedo1@gmail.com', 'alecastedo1', '$2y$10$La/NDWPvNDg8b/ZKcDn9QeUhw2Wbz4BeGx95CTKTR6E63FiDgbtEu', 1, 1, '2026-02-09 08:46:15', '2026-02-09 09:28:55'),
(2, 'Eduardo', 'Quiroga', '65061249', 'usuarios/LPSFuZp6Yd3TP3BEmLq8QXwg3sVxLCQxi6Ju8xnL.png', 'edu17@gmail.com', 'negro12', '$2y$10$mi8frzSWebsxATjNkl/ycuD1ikGl7WS7HyZfKl0n8dSzXbJT2LAGy', 2, 1, '2026-02-28 00:45:45', '2026-02-28 00:45:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` bigint(20) UNSIGNED NOT NULL,
  `numero` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `facturado_estado` tinyint(3) UNSIGNED NOT NULL COMMENT '0=no,1=si',
  `porcentaje_factura` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery` decimal(10,2) NOT NULL DEFAULT 0.00,
  `id_cliente` bigint(20) UNSIGNED NOT NULL,
  `total_sin_factura` decimal(12,2) NOT NULL,
  `total_con_factura` decimal(12,2) NOT NULL,
  `motivo_anulacion` text DEFAULT NULL,
  `fecha_anulacion` date DEFAULT NULL,
  `estado` tinyint(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT '0=anulada,1=pre-registro,2=registrada',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `numero`, `fecha`, `facturado_estado`, `porcentaje_factura`, `delivery`, `id_cliente`, `total_sin_factura`, `total_con_factura`, `motivo_anulacion`, `fecha_anulacion`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-03-11', 0, 0.00, 0.00, 1, 2300.00, 2300.00, 'Venta cargada por error', '2026-03-11', 0, '2026-03-11 23:04:24', '2026-03-11 23:05:53'),
(2, 2, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 2, '2026-03-11 23:21:00', '2026-03-12 17:23:39'),
(3, 3, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:35:18', '2026-03-11 23:35:18'),
(4, 4, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:36:52', '2026-03-11 23:36:52'),
(5, 5, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:38:02', '2026-03-11 23:38:02'),
(6, 6, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:40:10', '2026-03-11 23:40:10'),
(7, 7, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:41:01', '2026-03-11 23:41:01'),
(8, 8, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:42:48', '2026-03-11 23:42:48'),
(9, 9, '2026-03-11', 0, 0.00, 0.00, 1, 1750.00, 1750.00, NULL, NULL, 1, '2026-03-11 23:50:04', '2026-03-11 23:50:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_detalles`
--

CREATE TABLE `ventas_detalles` (
  `id_ventas_detalle` bigint(20) UNSIGNED NOT NULL,
  `id_venta` bigint(20) UNSIGNED NOT NULL,
  `id_producto` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(100) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `precio_compra` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cantidad` int(11) NOT NULL,
  `descuento` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_producto` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas_detalles`
--

INSERT INTO `ventas_detalles` (`id_ventas_detalle`, `id_venta`, `id_producto`, `codigo`, `nombre_producto`, `precio_unitario`, `precio_compra`, `cantidad`, `descuento`, `total_producto`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:04:24', '2026-03-11 23:04:24'),
(2, 1, 1, 'HM-300A', 'Máquina de soldar 300A', 550.00, 432.00, 1, 0.00, 550.00, '2026-03-11 23:04:24', '2026-03-11 23:04:24'),
(3, 2, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1200.00, 1, 0.00, 1750.00, '2026-03-11 23:21:00', '2026-03-12 17:23:39'),
(4, 3, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:35:18', '2026-03-11 23:35:18'),
(5, 4, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:36:52', '2026-03-11 23:36:52'),
(6, 5, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:38:02', '2026-03-11 23:38:02'),
(7, 6, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:40:10', '2026-03-11 23:40:10'),
(8, 7, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:41:01', '2026-03-11 23:41:01'),
(9, 8, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:42:48', '2026-03-11 23:42:48'),
(10, 9, 2, 'TOWP50', 'Motobomba de 2 Pulgadas', 1750.00, 1195.00, 1, 0.00, 1750.00, '2026-03-11 23:50:04', '2026-03-11 23:50:04');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  ADD PRIMARY KEY (`id_cotizacion`),
  ADD UNIQUE KEY `cotizaciones_numero_unique` (`numero`),
  ADD KEY `cotizaciones_id_cliente_foreign` (`id_cliente`);

--
-- Indices de la tabla `cotizaciones_detalles`
--
ALTER TABLE `cotizaciones_detalles`
  ADD PRIMARY KEY (`id_cotizacion_detalle`),
  ADD KEY `cotizaciones_detalles_id_cotizacion_foreign` (`id_cotizacion`),
  ADD KEY `cotizaciones_detalles_id_producto_foreign` (`id_producto`);

--
-- Indices de la tabla `ficha_tecnica`
--
ALTER TABLE `ficha_tecnica`
  ADD PRIMARY KEY (`id_ficha_tecnica`),
  ADD KEY `ficha_tecnica_id_producto_foreign` (`id_producto`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id_marca`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `productos_codigo_unique` (`codigo`),
  ADD UNIQUE KEY `productos_url_amigable_unique` (`url_amigable`),
  ADD KEY `productos_id_categoria_foreign` (`id_categoria`),
  ADD KEY `productos_id_marca_foreign` (`id_marca`),
  ADD KEY `productos_id_proveedor_foreign` (`id_proveedor`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuarios_email_unique` (`email`),
  ADD UNIQUE KEY `usuarios_username_unique` (`username`),
  ADD KEY `usuarios_id_rol_foreign` (`id_rol`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD UNIQUE KEY `ventas_numero_unique` (`numero`),
  ADD KEY `ventas_id_cliente_foreign` (`id_cliente`);

--
-- Indices de la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  ADD PRIMARY KEY (`id_ventas_detalle`),
  ADD KEY `ventas_detalles_id_venta_foreign` (`id_venta`),
  ADD KEY `ventas_detalles_id_producto_foreign` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  MODIFY `id_cotizacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cotizaciones_detalles`
--
ALTER TABLE `cotizaciones_detalles`
  MODIFY `id_cotizacion_detalle` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `ficha_tecnica`
--
ALTER TABLE `ficha_tecnica`
  MODIFY `id_ficha_tecnica` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id_marca` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  MODIFY `id_ventas_detalle` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  ADD CONSTRAINT `cotizaciones_id_cliente_foreign` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `cotizaciones_detalles`
--
ALTER TABLE `cotizaciones_detalles`
  ADD CONSTRAINT `cotizaciones_detalles_id_cotizacion_foreign` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones` (`id_cotizacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cotizaciones_detalles_id_producto_foreign` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ficha_tecnica`
--
ALTER TABLE `ficha_tecnica`
  ADD CONSTRAINT `ficha_tecnica_id_producto_foreign` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_id_categoria_foreign` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `productos_id_marca_foreign` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id_marca`),
  ADD CONSTRAINT `productos_id_proveedor_foreign` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_id_rol_foreign` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_id_cliente_foreign` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Filtros para la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  ADD CONSTRAINT `ventas_detalles_id_producto_foreign` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `ventas_detalles_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
