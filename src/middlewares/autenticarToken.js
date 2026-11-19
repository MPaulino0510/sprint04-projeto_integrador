import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // O ".split" separa, e faz o html receber apenas a segunda casa (por isso o "[1]". Quando o html recebe os dados, é recebido duas informações:
  // "Bearer", e "senha do usuário". Por isso, o código pega apenas a "senha do usuário", para facilitar a validação.

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Faça login para continuar." });
  }

  try {
    const dadosDecodificados = jwt.verify(token, process.env.JWT_SECRET);
    
    req.usuario = dadosDecodificados; 
    next();
  } catch (erro) {
    return res.status(403).json({ erro: "Token inválido ou expirado." });
  }
}