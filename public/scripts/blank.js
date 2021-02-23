var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("=");
for (var i = 0; i < queries.length; i++)
{
  console.log(queries[i]);
}