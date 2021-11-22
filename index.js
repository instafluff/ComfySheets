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

async function getDataFromSheet( sheetId, sheetTitle, columnMap, pageId = null ) {
  try {
    // From : https://benborgers.com/posts/google-sheets-json (THANK YOU CarstenPet!)
    let worksheetJson = await fetch( `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${ pageId ? "&gid=" + pageId : "" }` )
                  .then(res => res.text())
                  .then(text => {
                      return JSON.parse(text.substr(47).slice(0, -2));
                  });
      const cols = worksheetJson.table.cols;
      const rows = worksheetJson.table.rows;
      let data = rows.map( (r) => {
        console.log( r.c );
        let entry = {
          // date: new Date( ( r.Timestamp - ( 25567 + 1 ) ) * 86400 * 1000 ), // CodingGarden: (Looking up StackOverflow) This is whats happening: 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug") 2. Convert to milliseconds.
        };
        cols.forEach( ( c, i ) => {
          const columnName = c.label;
          try {
            console.log( r.c[ i ].v );
            if( columnName === "Timestamp" ) {
              // Parse the time!
              entry.date = new Date( r.c[ i ].f );
            }
            else {
                  if( columnMap[ columnName ] ) {
                    entry[ columnMap[ columnName ] ] = r.c[ i ].v;
                  }
                  else {
                    entry[ columnName ] = r.c[ i ].v;
                  }
            }
          }
          catch ( e ) { console.log( e ); }
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
