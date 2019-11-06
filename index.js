require('isomorphic-fetch');
const gsheets = require( "gsheets" );

// https://docs.google.com/forms/d/<form-id>/edit

const fetch = require('node-fetch');

async function submitDataToForm( formId, data ) {
  try {
    const body = new URLSearchParams( data );

    let res = await fetch( `https://docs.google.com/forms/d/e/${formId}/formResponse`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    if( !res.ok ) {
      throw new Error('Submit failed.');
    }
    return { status: true };
  }
  catch( err ) {
    return { status: false, error: err.message };
  }
}

async function getDataFromSheet( sheetId, sheetTitle, columnMap ) {
  try {
    let worksheet = await gsheets.getWorksheet( sheetId, sheetTitle );
    // console.log( res.updated );
    // console.log( res.title );
    let data = worksheet.data.map( r => {
      let date = new Date( ( r.Timestamp - ( 25567 + 1 ) ) * 86400 * 1000 ); // CodingGarden: (Looking up StackOverflow) This is whats happening: 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug") 2. Convert to milliseconds.
      let entry = {
        date: new Date( ( r.Timestamp - ( 25567 + 1 ) ) * 86400 * 1000 ), // CodingGarden: (Looking up StackOverflow) This is whats happening: 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug") 2. Convert to milliseconds.
      };
      Object.keys( r ).forEach( k => {
        if( columnMap[ k ] ) {
          entry[ columnMap[ k ] ] = r[ k ];
        }
        else {
          entry[ k ] = r[ k ];
        }
      });
      return entry;
    });

    return data;
  }
  catch( err ) {
    return { status: false, error: err.message };
  }
}

module.exports = {
  Submit: submitDataToForm,
  Read: getDataFromSheet
}
