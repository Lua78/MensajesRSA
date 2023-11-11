create database MensajeriaRSA

use MensajeriaRSA

CREATE TABLE usuarios (
    id INT identity PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	contraseña text NOT NULL,
    clave_privada TEXT NOT NULL,
    clave_publica TEXT NOT NULL
);
