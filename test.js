require( "dotenv" ).config();

const ComfySheets = require( "./index" );

async function testThisSheet() {
  // let result = await ComfySheets.Submit( process.env.FORMID, {
  //     'entry.326169323': "sparky_pugwash",
  //     'entry.983220439': "Cleaning",
  //     'entry.571649675': "put dish washing up liquid into grease stains"
  //   });
  // console.log( result );

  let worksheet = await ComfySheets.Read( process.env.SHEETID, 'Form Responses 1', {
    "Name (Twitch Username)": "name",
    "What type of Tip/Trick Is It?": "category",
    "Your Tip/Trick!": "tip",
  } );
  console.log( worksheet );
}

testThisSheet();
