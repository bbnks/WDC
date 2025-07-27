(function() {
    const myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        const cols = [
            { id: "rpt_rec_num", alias: "Report Number", dataType: tableau.dataTypeEnum.string },
            { id: "provider_ccn", alias: "Provider CCN", dataType: tableau.dataTypeEnum.string },
            { id: "name", alias: "Hospital Name", dataType: tableau.dataTypeEnum.string },
            { id: "address", alias: "Street Address", dataType: tableau.dataTypeEnum.string },
            { id: "city", alias: "City", dataType: tableau.dataTypeEnum.string },
            { id: "state", alias: "State Code", dataType: tableau.dataTypeEnum.string },
            { id: "zip", alias: "Zip Code", dataType: tableau.dataTypeEnum.string },
            { id: "facility_type", alias: "CCN Facility Type", dataType: tableau.dataTypeEnum.string },
            { id: "ownership", alias: "Type of Control", dataType: tableau.dataTypeEnum.string },
            { id: "fy_start", alias: "Fiscal Year Begin", dataType: tableau.dataTypeEnum.date },
            { id: "fy_end", alias: "Fiscal Year End", dataType: tableau.dataTypeEnum.date }
        ];

        const tableSchema = {
            id: "cms_data",
            alias: "CMS Hospital Dataset",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        // Get state from tableau connection data
        const state = tableau.connectionData || "NY";

        const url = `https://data.cms.gov/data-api/v1/dataset/44060663-47d8-4ced-a115-b53b4c270acb/data?State_Code=${state}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const tableData = [];

                data.forEach(item => {
                    tableData.push({
                        rpt_rec_num: item["rpt_rec_num"],
                        provider_ccn: item["Provider CCN"],
                        name: item["Hospital Name"],
                        address: item["Street Address"],
                        city: item["City"],
                        state: item["State Code"],
                        zip: item["Zip Code"],
                        facility_type: item["CCN Facility Type"],
                        ownership: item["Type of Control"],
                        fy_start: item["Fiscal Year Begin Date"],
                        fy_end: item["Fiscal Year End Date"]
                    });
                });

                table.appendRows(tableData);
                doneCallback();
            })
            .catch(err => {
                console.error("Fetch error:", err);
                doneCallback();
            });
    };

    tableau.registerConnector(myConnector);

    // Setup event listeners and submit logic
    document.addEventListener('DOMContentLoa(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        const cols = [
            { id: "rpt_rec_num", dataType: tableau.dataTypeEnum.string },
            { id: "Provider_CCN", alias: "Provider CCN", dataType: tableau.dataTypeEnum.string },
            { id: "Hospital_Name", dataType: tableau.dataTypeEnum.string },
            { id: "City", dataType: tableau.dataTypeEnum.string },
            { id: "State_Code", dataType: tableau.dataTypeEnum.string },
            { id: "Zip_Code", dataType: tableau.dataTypeEnum.string },
            { id: "Inpatient_Revenue", dataType: tableau.dataTypeEnum.float },
            { id: "Outpatient_Revenue", dataType: tableau.dataTypeEnum.float },
            { id: "Net_Patient_Revenue", dataType: tableau.dataTypeEnum.float },
            { id: "Total_Assets", dataType: tableau.dataTypeEnum.float },
            { id: "Total_Liabilities", dataType: tableau.dataTypeEnum.float },
            { id: "Total_Income", dataTyp_
ded', () => {
        const getDataBtn = document.getElementById("getDataBtn");
        const stateInput = document.getElementById("stateInput");
        const message = document.getElementById("message");

        getDataBtn.addEventListener("click", () => {
            const state = stateInput.value.trim().toUpperCase();

            if (!/^[A-Z]{2}$/.test(state)) {
                message.textContent = "Please enter a valid 2-letter state code.";
                return;
            }

            message.textContent = "";

            tableau.connectionName = `CMS Data for ${state}`;
            tableau.connectionData = state;

            tableau.submit();
        });
    });
})();
