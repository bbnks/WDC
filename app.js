(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    var cols = [
      { id: "provider", alias: "Provider Name", dataType: tableau.dataTypeEnum.string },
      { id: "state", alias: "State Code", dataType: tableau.dataTypeEnum.string },
      { id: "measure", alias: "Measure Code", dataType: tableau.dataTypeEnum.string },
      { id: "score", alias: "Score", dataType: tableau.dataTypeEnum.string },
      { id: "sample", alias: "Sample", dataType: tableau.dataTypeEnum.int }
    ];

    var tableSchema = {
      id: "cms_quality",
      alias: "CMS Quality Measures (NY)",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    var url = "https://data.cms.gov/data-api/v1/dataset/44060663-47d8-4ced-a115-b53b4c270acb/data?state_cd=NY&limit=10000";

    fetch(url)
      .then(response => response.json())
      .then(data => {
        var tableData = data.map(item => ({
          provider: item["Provider Name"],
          state: item["State Code"],
          measure: item["Measure Code"],
          score: item["Score"],
          sample: parseInt(item["Sample"]) || 0
        }));

        table.appendRows(tableData);
        doneCallback();
      });
  };

  tableau.registerConnector(myConnector);

  window.submit = function () {
    tableau.connectionName = "CMS Quality Measures (NY)";
    tableau.submit();
  };
})();
