
async function fetchJSON() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
    const data = await response.json();
    return data.data;
  }

 function render(arr){
  const w = 700;
  const h = 400;
  const padding=50;
  const minDate=new Date(arr[0][0].substring(0,4))
  const maxDate=new Date(arr[arr.length-1][0].substring(0,4))
        maxDate.setMonth(maxDate.getMonth() + 3)
  const barWidth=w/arr.length

  const xScale = d3.scaleTime()
                .domain([minDate,maxDate])
                .range([0, w ]);

  const yScale = d3.scaleLinear()
                .domain([0, d3.max(arr, (d) => d[1])])
                .range([h , 0]);

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3.axisLeft(yScale)

  const svg = d3.select("body")
            .append("svg")
            .attr("width", w+padding*2)
            .attr("height", h+padding*2)
            .attr("transform", "translate(" + 0 + "," + 0+ ")");

  const hoverInfo = d3.select("body")
                    .append("div")
                    .attr("class","hoverInfo")
                    .style("opacity", 0)
                    .attr("id","tooltip")
     
  function mouseoverHandler(event ,d) {    
         
    hoverInfo.transition()
             .style("opacity", .8)
         
    hoverInfo.style("left" , (event.pageX + 10) + "px")
             .style("top" , (event.pageY + 15) + "px")
             .html(`<p>Fecha:  ${d[0]}</p><p> Billones:   ${d[1]} </p>`)
             .attr("data-date",d[0])

         d3.select(this)
            .style("opacity", .5)
    
  }
       
  function mouseoutHandler(d) {
        
    d3.select(this).style("fill", "#42855B")
                   .style("opacity", 1)
         
    hoverInfo.transition().style("opacity", 0)  
                  
  }
       
 
  svg.selectAll("rect")
     .data(arr)
     .enter()
     .append("rect")
     .attr("x", (d, i) => (i*barWidth)+padding )
     .attr("y", (d) =>yScale(d[1])+padding)
     .attr("width", barWidth)
     .attr("height", d => h- yScale(d[1]))
     .attr("fill", "#42855B")
     .attr("class","bar")
     .attr("data-date",d=>d[0])
     .attr("data-gdp",d=>d[1])
     .on('mouseover', mouseoverHandler)
     .on('mouseleave', mouseoutHandler)
       
    svg.append("g")
     .attr("id","x-axis")
     .attr("transform", "translate(50," + (h+50)  + ")")
     .call(xAxis)
     
    svg.append("g")
     .attr("id","y-axis")
     .attr("transform", "translate("+padding +",50)")
     .call(yAxis)

 }
 

 fetchJSON()
 .then(data=>render(data) )
 .catch(err=>console.log(err))

