USE projeto_integrador;
SHOW TABLES;


RENAME TABLE cadastro TO endereco;

ALTER TABLE endereco;
DROP COLUMN endereco;

SELECT endereco FROM endereco;

ALTER TABLE endereco DROP COLUMN endereco;

DESCRIBE endereco;

ALTER TABLE endereco RENAME COLUMN id_cadastro TO id_endereco;

ALTER TABLE endereco 
ADD COLUMN estado CHAR(2),
ADD COLUMN bairro VARCHAR(100),
ADD COLUMN numero VARCHAR(20),
ADD COLUMN logradouro VARCHAR(150);

DESCRIBE endereco;