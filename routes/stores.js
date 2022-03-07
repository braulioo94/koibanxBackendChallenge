const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const users = require('../models/user');
const Store = require('../models/store')
const authenticate=require('../middleware/authenticate')
const storeFormatter = require ('../utils/storeFormatter');
const e = require('express');


  router.route('/stores')
  .post(authenticate,async(req,res)=>{
    try {
      const name = req.body.name;
      const cuit= req.body.cuit;
      const concepts= req.body.concepts;
      const currentBalance= req.body.currentBalance;
      const lastSale=  new Date(req.body.lastSale);
      const active= req.body.active;
    
      if(!name||name.trim().length===0||!cuit||cuit.trim().length===0||!concepts||concepts.trim().length===0||!currentBalance||currentBalance.trim().length===0||!lastSale||lastSale.trim().length===0||!active||active.trim().length===0) throw new Error('Incomplete information error')

      let store = new Store();
      store.name = name;
      store.cuit = cuit;
      store.concepts = concepts;
      store.currentBalance = currentBalance;
      store.active = active;
      store.lastSale = lastSale;
      
      await Store.create(store); 
     
      res.status(200).send(store)

    } catch (error) {
        console.error(error.message);   
        res.status(413).send({"Error": error.message});
    }
  });



  router.route('/stores')
  .get(authenticate,async(req,res)=>{
    try {
      logger.info('GET request received: \n', decodeURI(req.originalUrl));
      const {q, sort, page, limit} = req.query;
      const getFormattedData = storeFormatter(getStoreData);
      res.status(200).json(await getFormattedData(q, sort, page, limit));
    } catch(error) {
        console.error(error.message);  
        res.status(500).send({"Error": error.message});
    }
  }); 


   async function getStoreData(q, sort, page = 1, limit = 10) {
    let query = Store.find(q);
    if(sort)
    console.log(sort);
    console.log(query);
      query = query.sort(sort);
      query = query.skip((page-1)*limit).limit(limit);
    return await query;
  } 

 





module.exports = router;
