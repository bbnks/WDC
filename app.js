(function() {
  const cmsAPI = 'https://data.cms.gov/data-api/v1/dataset/44060663-47d8-4ced-a115-b53b4c270acb/data';

  const myConnector = tableau.makeConnector();

  myConnector.getSchema = function(schemaCallback) {
    const cols = [
      { id: 'rpt_rec_num', alias: 'Record Number', dataType: tableau.dataTypeEnum.string },
      { id: 'Provider CCN', alias: 'Provider CCN', dataType: tableau.dataTypeEnum.string },
      { id: 'Hospital Name', alias: 'Hospital Name', dataType: tableau.dataTypeEnum.string },
      { id: 'City', alias: 'City', dataType: tableau.dataTypeEnum.string },
      { id: 'State Code', alias: 'State Code', dataType: tableau.dataTypeEnum.string },
      { id: 'Total Costs', alias: 'Total Costs', dataType: tableau.dataTypeEnum.float },
      { id: 'Total Discharges Title XVIII', alias: 'Medicare Discharges', dataType: tableau.dataTypeEnum.float },
      { id: 'Total Bed Days Available', alias: 'Total Bed Days Available', dataType: tableau.dataTypeEnum.float },
      { id: 'Net Income', alias: 'Net Income', dataType: tableau.dataTypeEnum.float },
      { id: 'Net Patient Revenue', alias: 'Net Patient Revenue', dataType: tableau.dataTypeEnum.float }
    ];

    const tableSchema = {
      id: 'cmsHospitalData',
      alias: 'CMS Hospital Financial Data',
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function(table, doneCallback) {
    const stateCode = tableau.connectionData; // stored from input box

    const url = `${cmsAPI}?State_Code=${stateCode}&limit=5000`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const tableData = data.map(item => ({
          'rpt_rec_num': item['rpt_rec_num'],
          'Provider CCN': item['Provider CCN'],
          'Hospital Name': item['Hospital Name'],
          'City': item['City'],
          'State Code': item['State Code'],
          'Total Costs': parseFloat(item['Total Costs']) || 0,
          'Total Discharges Title XVIII': parseFloat(item['Total Discharges Title XVIII']) || 0,
          'Total Bed Days Available': parseFloat(item['Total Bed Days Available']) || 0,
          'Net Income': parseFloat(item['Net Income']) || 0,
          'Net Patient Revenue': parseFloat(item['Net Patient Revenue']) || 0
        }));

        table.appendRows(tableData);
        doneCallback();
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        doneCallback();
      });
  };

  tableau.registerConnector(myConnector);

  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submitButton").addEventListener("click", function() {
      const state = document.getElementById("stateInput").value.trim().toUpperCase();

      if (!state || state.length !== 2) {
        alert("Please enter a valid 2-letter state code (e.g., NY)");
        return;
      }

      tableau.connectionData = state;
      tableau.connectionName = "CMS Hospital Financial Data for " + state;
      tableau.submit(); // triggers getSchema and then getData
    });
  });
})();
