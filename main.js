canvas = document.getElementById("Canvas");
ctx = canvas.getContext("2d");

color1 = "blue";
color2 = "yellow";
color3 = "black";
color4 = "green";
color5 = "red";

ctx.beginPath();
ctx.strokeStyle = color1;
ctx.lineWidth = 5;
ctx.arc(240,250,40,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = color2;
ctx.lineWidth = 5;
ctx.arc(270,290,40,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = color3;
ctx.lineWidth = 5;
ctx.arc(310,250,40,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = color4;
ctx.lineWidth = 5;
ctx.arc(360,290,40,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = color5;
ctx.lineWidth = 5;
ctx.arc(380,250,40,0,2*Math.PI);
ctx.stroke();