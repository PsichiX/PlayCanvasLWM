LWM (compressed PlayCanvas model) file format toolset
------

* Live demo can be found here: https://playcanvas.com/project/358306/overview/lwm-model-example
* Downloadable SDK can be found here: https://github.com/PsichiX/PlayCanvasLWM/releases

Tool usage:
------

1. To convert PlayCanvas JSON model into LWM model, first you need to get JSON file of your model uploaded into PlayCanvas Editor.

2. Then you have to process it with `convertlwm.exe` tool (found in: `/tools/`; it'swritten in C#, so .NET 4.5 is needed to be installed on your machine):

  ```bash
  convertlwm.exe -v -i truck.json -o truck.lwm -r -jtb -sspd -ipq 64
  ```
  * `-v` - process will be verbose;
  * `-i truck.json` - path to input JSON file;
  * `-o truck.lwm` - path to output LWM file;
  * `-r` - overwrite output file if already exists;
  * `-jtb` - convert from JSON to LWM (if you want to convert from LWM to JSON, then you use `-btj`);
  * `-sspd` - enables Small Size of Packed Data mode (model will be compressed, not just translated into binary);
  * `-ipq 64` - defines Items Per Quant count (when used with `-sspd` it will quantize data into chunks that can be compressed even more than without quantization: small chunks - better compression);

3. Upload compressed LWM model onto external server that support CORS (cross-origin) - if your server cannot support CORS for LWM files, you can use `getlwmfile.php` and `.htaccess` files from `/cors/` folder.

4. Add `lib/lwm.js`(debug) or `lib/lwm.min.js`(release) LWM scripts into root object in scene (this library hooks into PlayCanvas engine and allow to decompress and convert LWM files into `pc.Model` instances).

5. Add `components/LWMModel.js` component script into your entity scripts and put address of externally hosted LWM model file into `url` attribute (note that because you cannot upload LWM model files into PlayCanvas Editor, you have to host them externally).

6. Create new JSON file with LWM materials maping description content, that will looks like:

  ```json
  {
    "meshInstancesMapping": [
      "Right_Wiper",
      "Left_Wiper",
      "Right_Rear",
      "Left_Rear",
      "Left_Front",
      "Right_Front",
      "TruckBody"
    ],
    "materialsMapping": {
      "Right_Wiper": "Pickup Truck Texture",
      "Left_Wiper": "Pickup Truck Texture",
      "Right_Rear": "Pickup Truck Texture",
      "Left_Rear": "Pickup Truck Texture",
      "Left_Front": "Pickup Truck Texture",
      "Right_Front": "Pickup Truck Texture",
      "TruckBody": "Pickup Truck Texture"
    }
  }
  ```
  * meshInstancesMapping tells which mesh instance index will have which name;
  * materialsMapping tells which mesh instance name will have which material (material can be either string name or assed id number);

7. Attach that JSON into `materialsMapping` attribute.

8. Run your game and check if there is no errors. If you will get an error during LWM model loading, the most reason is that your server does not support CORS correctly - check details in browser debug console!

TODO:
------

* native `float` data compression (currently it only compress `int`, `uint` and `string`);
