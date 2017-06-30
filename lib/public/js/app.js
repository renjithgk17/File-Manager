(function($){
    var currentPath = null;
    var options = {
        "bProcessing": true,
        "bServerSide": false,
        "bPaginate": false,
        "bAutoWidth": false,
        "sScrollY":"250px",
        "fnCreatedRow" :  function( nRow, aData, iDataIndex ) {
            if (!aData.IsDirectory) return;
            var path = aData.Path;
            $(nRow).bind("click", function(e){
                $.get('/files?path='+ path).then(function(data){
                    table.fnClearTable();
                    table.fnAddData(data);
                    currentPath = path;
                });
                e.preventDefault();
            });
        },
        "aoColumns": [
            { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "55px",
                "render": function (data, type, row, meta) {
                    if (data.IsDirectory) {
                        return "<a href='#' target='_blank'><i class='fa fa-folder'></i>&nbsp;" + data.Name +"</a>";
                    } else {
                        return "<a href='/" + data.Path + "' target='_blank'><i class='fa " + getFileIcon(data.Ext) + "'></i>&nbsp;" + data.Name +"</a>";
                    }
                }
            }
        ]
    };


    getFolderDetails("D:\\");
      $(".up").bind("click", function(e){
        if (!currentPath) return;
        var idx = currentPath.lastIndexOf("/");
        var path =currentPath.substr(0, idx);
        $.get('/files?path='+ path).then(function(data){
            table.fnClearTable();
            table.fnAddData(data);
            currentPath = path;
        });
    });


})(jQuery);

/*File extensions*/
var extensionsMap = {
    ".zip" : "fa-file-archive-o",
    ".gz" : "fa-file-archive-o",
    ".bz2" : "fa-file-archive-o",
    ".xz" : "fa-file-archive-o",
    ".rar" : "fa-file-archive-o",
    ".tar" : "fa-file-archive-o",
    ".tgz" : "fa-file-archive-o",
    ".tbz2" : "fa-file-archive-o",
    ".z" : "fa-file-archive-o",
    ".7z" : "fa-file-archive-o",
    ".mp3" : "fa-file-audio-o",
    ".cs" : "fa-file-code-o",
    ".c++" : "fa-file-code-o",
    ".cpp" : "fa-file-code-o",
    ".js" : "fa-file-code-o",
    ".xls" : "fa-file-excel-o",
    ".xlsx" : "fa-file-excel-o",
    ".png" : "fa-file-image-o",
    ".jpg" : "fa-file-image-o",
    ".jpeg" : "fa-file-image-o",
    ".gif" : "fa-file-image-o",
    ".mpeg" : "fa-file-movie-o",
    ".pdf" : "fa-file-pdf-o",
    ".ppt" : "fa-file-powerpoint-o",
    ".pptx" : "fa-file-powerpoint-o",
    ".txt" : "fa-file-text-o",
    ".log" : "fa-file-text-o",
    ".doc" : "fa-file-word-o",
    ".docx" : "fa-file-word-o"
};

/*To get the click event*/
function getFolderDetails(obj,event){
    dataid = "";
    if(typeof obj !== "string"){
        dir = obj.attr("data-name");
        dataid = obj.attr("data-id");
    } else {dir = obj; }
    if(dataid.length!=0){
        dir = dataid+"\\"+dir;
    }
    var row = "";
    $.get('/files?dir="'+dir+'"').then(function(data){
         $("#tableIns").html();
        data.forEach(function (datarow,index) {
            var icon
            if(datarow.IsDirectory) {
                icon= "<i class='fa fa-folder'></i>"
                datarow.size = "";
            } else {
                icon = "<i class='fa " + getFileIcon(datarow.Ext) + "'></i>&nbsp;"
            }
            $('#tableIns').find('tr').bind("click", function(e){
                console.log(this);
                var path = $(this).find("a").html();
                if(path) {
                    window.location = path;
                    console.log("href:"+path)
                }
            });
// display files to row
             row = row+"<div class='sortable'>" +
               /* "<td><input type='checkbox' value=''></td>"+*/
                "<td><span class='folder-color'>"+icon+"</span></td>"+
                 "<td><span class='span-link' id='q"+index+"' onclick='getFolderDetails($(this),this)'  data-name='"+datarow.Name+"'  data-id='"+datarow.currentDir+"\'>"+datarow.Name+"</span></td></div>";
        });
        /*For getting the folder contents on click of folder.*/
        if(typeof obj !== "string"){
            var htmldata = "<div style='padding-left:30px;'>"+row+"</div>";
            $(obj).find("div");
            if($(obj).find("div").length ==0) {
                $(obj).append(htmldata);
            }
        } else {$("#tableIns").append(row);}
        return false;
    });
}
/*Load File Icons to File Extensions*/
function getFileIcon(ext) {
    return ( ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
}
