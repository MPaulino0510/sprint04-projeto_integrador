-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.3.2-MariaDB - MariaDB Server
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura para tabela projeto_integrador.carrinho_de_compra
CREATE TABLE IF NOT EXISTS `carrinho_de_compra` (
  `id_carrinho` int(11) NOT NULL AUTO_INCREMENT,
  `status_carrinho` varchar(30) DEFAULT 'Aberto',
  `data_criacao` datetime DEFAULT current_timestamp(),
  `id_cliente` int(11) NOT NULL,
  PRIMARY KEY (`id_carrinho`),
  KEY `fk_carrinho_cliente` (`id_cliente`),
  CONSTRAINT `fk_carrinho_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf_cnpj` varchar(18) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `tipo_cultura` varchar(50) DEFAULT 'Geral',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `cpf_cnpj` (`cpf_cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.compra
CREATE TABLE IF NOT EXISTS `compra` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `nome_produto` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `id_carrinho` int(11) NOT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `fk_compra_carrinho` (`id_carrinho`),
  CONSTRAINT `fk_compra_carrinho` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinho_de_compra` (`id_carrinho`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.consulta
CREATE TABLE IF NOT EXISTS `consulta` (
  `id_consulta` int(11) NOT NULL AUTO_INCREMENT,
  `descricao_tecnica` text NOT NULL,
  `status_consulta` varchar(30) DEFAULT 'Pendente',
  `id_cliente` int(11) NOT NULL,
  PRIMARY KEY (`id_consulta`),
  KEY `fk_consulta_cliente` (`id_cliente`),
  CONSTRAINT `fk_consulta_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.endereco
CREATE TABLE IF NOT EXISTS `endereco` (
  `id_endereco` int(11) NOT NULL AUTO_INCREMENT,
  `cidade` varchar(50) NOT NULL,
  `cep` varchar(9) NOT NULL,
  `complemento` varchar(50) DEFAULT NULL,
  `id_cliente` int(11) NOT NULL,
  `estado` char(2) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `logradouro` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_endereco`),
  UNIQUE KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `fk_cadastro_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.login
CREATE TABLE IF NOT EXISTS `login` (
  `id_login` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  PRIMARY KEY (`id_login`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `fk_login_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.nota_fiscal
CREATE TABLE IF NOT EXISTS `nota_fiscal` (
  `id_nota_fiscal` int(11) NOT NULL AUTO_INCREMENT,
  `numero_nf` varchar(50) NOT NULL,
  `chave_acesso` varchar(44) NOT NULL,
  `id_venda` int(11) NOT NULL,
  PRIMARY KEY (`id_nota_fiscal`),
  UNIQUE KEY `numero_nf` (`numero_nf`),
  UNIQUE KEY `chave_acesso` (`chave_acesso`),
  UNIQUE KEY `id_venda` (`id_venda`),
  CONSTRAINT `fk_notafiscal_venda` FOREIGN KEY (`id_venda`) REFERENCES `venda` (`id_venda`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projeto_integrador.venda
CREATE TABLE IF NOT EXISTS `venda` (
  `id_venda` int(11) NOT NULL AUTO_INCREMENT,
  `data_venda` datetime DEFAULT current_timestamp(),
  `valor_total` decimal(10,2) NOT NULL,
  `forma_pagamento` varchar(50) NOT NULL,
  `status_pagamento` varchar(30) NOT NULL,
  `status_entrega` varchar(30) DEFAULT 'Em Processamento',
  `id_carrinho` int(11) NOT NULL,
  PRIMARY KEY (`id_venda`),
  KEY `fk_venda_carrinho` (`id_carrinho`),
  CONSTRAINT `fk_venda_carrinho` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinho_de_compra` (`id_carrinho`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exportação de dados foi desmarcado.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
