import { Request, Response } from "express";
import axios from "axios";

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = 'https://api.rajaongkir.com/starter'
axios.defaults.headers.common['key'] = 'a57eb886a6259222de4b82c5deee42ef'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export const getProvinsi = async (req: Request, res: Response) => {
   axios.get('/province')
    .then(response => res.json(response.data))
    .catch(err => res.send(err))
}

export const getKota = async (req: Request, res: Response) => {
   const {id} = req.params;
  axios.get(`/city?province=${id}`)
    .then(response => res.json(response.data))
    .catch(err => res.send(err))
}

export const getOngkir = async (req: Request, res: Response) => {
  const param = req.params

  axios.post('/cost', {
      origin: param.asal,
      destination: param.tujuan,
      weight: param.berat,
      courier: param.kurir
    })
    .then(response => res.json(response.data))
    .catch(err => res.send(err))
}