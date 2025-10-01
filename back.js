const express = require("express")
const sqlite3 = require("sqlite3")
const cors = require("cors")

const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./database.db")

db.run(`CREATE TABLE IF NOT EXISTS livros(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    titulo TEXT,
    autor TEXT,
    ano_publi TEXT,
    gênero TEXT,
    idioma TEXT,
    Preço TEXT
    )`)

    // app.get("/", async (req, res) => {
    //     res.json({
    //         "teste": "ok"
    //     })
    // })
    app.post("/livros", async (req, res) => {

        console.log(req.body);

    let ID = req.body.ID;
    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let ano_publi = req.body.ano_publi;
    let gênero = req.body.gênero;
    let idioma = req.body.idioma;
    let Preço = req.body.Preço;

    db.run(`INSERT INTO livros (ID, titulo, autor, ano_publi, gênero, idioma, Preço) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [ID, titulo, autor, ano_publi, gênero, idioma, Preço],

    res.json({
    
      ID,
      titulo,
      autor,
      ano_publi,
      gênero,
      idioma,
      Preço
    })
    )
});

app.get("/livros", (req, res) => {
    db.all(`SELECT id, titulo, autor, ano_publi, gênero, idioma, Preço FROM livros`, [], (err, rows) =>{
        res.json(rows)
        })
    })

app.get("/livros/:id", (req, res) => {
    let idLivro = req.params.idLivro;

    db.get(`SELECT ID, titulo, autor, ano_publi, gênero, idioma, Preço FROM livros
        WHERE id = ?`,
    [idLivro], (err, result) => {
        if(result){
            res.json(result)
        } else {
            res.status(404).json({
                "message" : "Usuário não encontrado."
            })
        }
    })
})
app.delete("/livros/:id", (req, res) => {
    let idLivro = req.params.idLivro

    db.run(`DELETE FROM livros WHERE id = ?`, 
    [idLivro], function(){

        if(this.changes === 0){
            res.status(404).json({
                "message" : "Livro não encontrado"
            })
        }

        res.json({
            "message" : "Livro deletado :D"
        })
    })    
})

app.put("/livros/:id", async (req, res) => {
    let idLivro = req.params.idLivro

    let ID = req.body.ID
    let titulo = req.body.titulo
    let autor = req.body.autor
    let ano_publi = req.body.ano_publi
    let gênero = req.body.gênero
    let idioma = req.body.idioma
    let Preço = req.body.Preço

    db.run(`UPDATE livros SET ID = ?, titulo = ?, autor = ?, ano_publi = ?, gênero = ?, idioma = ?, Preço = ?
        WHERE id = ?`, [ID, titulo, autor, ano_publi, gênero, idioma, Preço],
        function(){
            res.json({
                "message" : "Livro atualizado com sucesso"
            })
        })
})


// Iniciar o server
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

