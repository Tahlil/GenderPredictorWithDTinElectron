function plotResult(tabledata, currentNumberPlot){
  var table = new Tabulator("#res-table"+ currentNumberPlot, {
    height:"311px",
    layout:"fitColumns",
    //reactiveData:true, //turn on data reactivity
    data:tabledata, //load data into table
    columns:[
        {title:"Name", field:"name", sorter:"string", width:200},
        {title:"Predicted Gender", field:"predicted", sorter:"string"},
        {title:"Actual Gender", field:"actual", sorter:"string"},
        {title:"Success", field:"hasPredicted", formatter:"tickCross", align:"center", width:100}
    ],
});
}