import { Router } from "express";
import { methods as languageController } from "./../controllers/language.controller";
import cors from 'cors';

const router = Router();

let corsOptions = {
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

var allowlist = ["http://localhost:3001", "http://localhost:3000"]
var corsOptionsDelegate = function (req, callback) {
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { ...corsOptions, origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { ...corsOptions, origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

router.use(cors(corsOptionsDelegate));

router.get("/procesos", languageController.getProcesos);
router.get("/hilos", languageController.getHilos);
router.get("/hilos/:id", languageController.getDetalleHilo);
router.post("/hilos", languageController.insertHilo);

export default router;
