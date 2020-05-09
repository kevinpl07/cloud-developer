import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get( "/filteredimage/", async (req: express.Request, res: express.Response  ) => {
    
    const image_url: string  = req.query.image_url as string;
    const isImageUrl: NodeRequire = require('is-image-url');
    

   
    if (isImageUrl(image_url)){
        
      const filtered_image_path: string = await filterImageFromURL(image_url);
    
      res.status(200).sendFile(filtered_image_path)

      var images_to_delete_array: Array<string> = [];
      images_to_delete_array.push(filtered_image_path);
      await sleep(5000);      
      deleteLocalFiles(images_to_delete_array);
    } 
    else {
      return res.status(400).send({ message: 'Image URL is invalid!' });
    }

  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();