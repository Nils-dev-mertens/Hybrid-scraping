CREATE TABLE companies (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Baseurl VARCHAR(255) NOT NULL,
    Companyname VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE aiproviders (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE aimodels (
    name VARCHAR(255) PRIMARY KEY,
    thought BOOLEAN NOT NULL,
    fast BOOLEAN NOT NULL,
    ProviderId INT NOT NULL,
    FOREIGN KEY (ProviderId) REFERENCES aiproviders(Id)
);

CREATE TABLE extensions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    ModelName VARCHAR(255) NOT NULL,
    Ai_generated BOOLEAN NOT NULL,
    Verified BOOLEAN NOT NULL,
    Tag VARCHAR(255) NOT NULL,
    Last_edited DATETIME NOT NULL,
    QuerySelectors JSON NOT NULL,

    FOREIGN KEY (CompanyId) REFERENCES companies(Id),
    FOREIGN KEY (ModelName) REFERENCES aimodels(name)
);

