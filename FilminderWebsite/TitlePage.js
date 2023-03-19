let table = document.getElementById("table");

//fake data
const contentList = [
   //row1
   [{title: "title"},{title: "title"},{title: "title"}],
   //row2
   [{title: "title"},{title: "title"},{title: "title"}],
   //row3
   [{title: "title"},{title: "title"},{title: "title"}]
];

//function to generate a row.
const rowTemplate = (data, rowNumber) =>{
    let rowString = "<tr>";
    data.forEach((td, index)=>{
        rowString += `<td>${td.title}, row: ${rowNumber}, column: ${index}</td>`;
    });
    rowString += "</tr>"
    return rowString;
};

//function to generate all the rows
const generateRows = (data, elementToPopulate) => {
    let htmlString = "";
    data.forEach((row,index)=>{
        htmlString += rowTemplate(row, index);
    });
    elementToPopulate.innerHTML = htmlString;
}

//call method
generateRows(contentList, table);