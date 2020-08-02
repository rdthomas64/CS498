// format numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }    

// set the size of the graph
var margin = {top: 30, right: 80, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// parse year from date
var parseTime = d3.timeParse("%Y-%m-%d");

// format ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var yr = d3.scaleLinear().range([height, 0]);

// add line
var valueline = d3.line()
    .x(function(d) { return x(parseTime(d.year)); })
    .y(function(d) { return y(d.gwh); });

var popline = d3.line()
    .x(function(d) { return x(parseTime(d.year)); })
    .y(function(d) { return yr(d.pop); });

// create graph
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var g = svg.append("g").attr("transform", "translate(10, 0)");
        
// get data
d3.json("https://raw.githubusercontent.com/rdthomas64/CS498/master/docs/gwh_all.json").then(function(data) {

    // format data
    data.forEach(function(d) {
        d.date = parseTime(d.year);
        d.gwh = +d.gwh;
        d.pop = +d.pop;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return parseTime(d.year); }));
    y.domain([150000, 170000]);
    yr.domain([19000000, 20000000]);

    // append attrs to svg
    svg.append("path").data([data]).attr("class", "line").attr("d", valueline);
    svg.append("path").data([data]).attr("class", "line").style("stroke", "red").attr("d", popline);
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

    // add y axis
    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", "translate( " + width + ", 0 )").call(d3.axisRight(yr));

    // add y axis descriptions
    svg.append("text")      // text label for the x axis
        .attr("x", margin.left - 100 )
        .attr("y", margin.top - 45 )
        .style("text-anchor", "middle")
        .text("GWH");

    svg.append("text")      // text label for the x axis
        .attr("x", margin.left + 620 )
        .attr("y", margin.top - 45 )
        .style("text-anchor", "middle")
        .text("Population");
    
    // add legend
    

    // add circles to data points         
    g.selectAll("circle").data(data).enter().append("circle")
    .attr("cx", function(d) { return x(parseTime(d.year)) - 10; })
    .attr("cy", function(d) { return y(d.gwh); })
    .attr("cz", function(d) { return yr(d.pop); })
    .attr("r", function(d, i) { return 7; })
    .attr("id", function(d) { return d.id; })
    .style("fill", "#aacc33")
    .on("mouseover", function(d){
    // add mouseover data to data points
        d3.select(this).transition().duration(200).style("fill", "#cc0033");

        g.selectAll("#tooltip").data([d]).enter().append("text")
        .attr("id", "tooltip")
        .text(function(d, i) { return 'Year:' + d.year.substring(0,4) + ', GWH: ' + numberWithCommas(d.gwh) + ', Pop: ' + numberWithCommas(d.pop); })

        g.selectAll("#tooltip_path").data([d]).enter().append("line")
        .attr("id", "tooltip_path")
        .attr("class", "line")
        .attr("d", valueline)
        .attr("x1", function(d) {return x(parseTime(d.year)) })
        .attr("x2", function(d) {return x(parseTime(d.year)) })
        .attr("y1", height)
        .attr("y2", function(d) {return y(d.gwh)})
        .attr("stroke", "steelblue")
        .style("stroke-dasharray", ("3, 3"));})
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(500).style("fill", "#aacc33");
            g.selectAll("#tooltip").remove();
            g.selectAll("#tooltip_path").remove();
    });
    var line = svg.append('g');

    line.append("line")
        .attr("x1", x(parseTime('2008-01-01')))  
        .attr("y1", 10)
        .attr("x2", x(parseTime('2008-01-01')))  
        .attr("y2", height)
        .style("stroke-width", 2)
        .style("stroke", "grey")
        .style("fill", "none");

    line.append("text")
        .attr('class', 'barsEndlineText')
        .attr('text-anchor', 'middle')
        .attr("x", 305)
        .attr("y", 20)
        .style("font-weight", "bold")
        .text('EISA enacted');
       
});