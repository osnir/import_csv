import { Request, Response, Router } from 'express';
import { Readable } from 'stream';
import readline from 'readline';
import multer from 'multer';
import { connection } from './connection';


const multerConfig = multer();

const router = Router();


interface Atividade {
    nome: string;
}

interface Cliente {
    documento: string;
    nome: string;    
    qtd_moderninha: number;
    cidade: string;
    uf: string;
    endereco: string;
    telefone: string;
    atividade: number;
}

router.post('/atividades', multerConfig.single('file'), async (request: Request, response: Response) => {
//    console.log(request.file?.buffer.toString('utf-8'));
    
    const { file } = request;
    const  buffer  = file?.buffer;

    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const lines = readline.createInterface({
        input: readableFile
    });

    const atividades: Atividade[] = [];

    for await(let line of lines) {
        const lineSplit = line.split(';');

        if (!lineSplit[0] || lineSplit[0] === 'Coluna1') {
            continue;
        }

        atividades.push({
            nome: lineSplit[0].trim()
        });
    }

    for await (let { nome } of atividades) {
        const sql = 'INSERT INTO atividade (nome) VALUES (?)';
        const values = [nome];
        await connection.query(sql, values);
    }

    return response.json(atividades);
});


router.post('/clientes', multerConfig.single('file'), async (request: Request, response: Response) => {
    //  console.log(request.file?.buffer.toString('utf-8'));
    
        const { file } = request;
        const  buffer  = file?.buffer;
    
        const readableFile = new Readable();
        readableFile.push(buffer);
        readableFile.push(null);
    
        const lines = readline.createInterface({
            input: readableFile
        });
    
        const clientes: Cliente[] = [];
    
        for await(let line of lines) {
            const lineSplit = line.split(';');
    
            if (!lineSplit[0] || lineSplit[0] === 'Coluna1') {
                continue;
            }
    
            clientes.push({
                nome: lineSplit[0].trim(),
                documento: lineSplit[1].trim(),            
                qtd_moderninha: Number(lineSplit[2]),
                cidade: lineSplit[3].trim(),
                uf: lineSplit[4].trim(),
                endereco: lineSplit[5].trim(),
                telefone: lineSplit[6].trim(),
                atividade: Number(lineSplit[7])
            });
        }
    
        for await (let { nome, documento, qtd_moderninha, cidade, uf, endereco, telefone, atividade } of clientes) {
            const sql = 'INSERT INTO cliente (nome,documento,qtd_moderninha,cidade_ent,uf_ent,endereco,telefone,id_atividade) VALUES (?,?,?,?,?,?,?,?)';
            const values = [nome, documento, qtd_moderninha, cidade, uf, endereco, telefone, atividade];
            await connection.query(sql, values);
        }
    
        return response.json(clientes);
    });

export { router };