<html>
<head>
<title>thing</title>
<meta http-equiv="Content-Type" content="text/html">
</head>

<body>

<?php 
 
// Web page URL 
$url = 'https://www.codexworld.com/'; 
 
// Extract HTML using curl 
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_HEADER, 0); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); 
 
$data = curl_exec($ch); 
curl_close($ch); 
 
// Load HTML to DOM object 
$dom = new DOMDocument(); 
@$dom->loadHTML($data); 
 
// Parse DOM to get Title data 
$nodes = $dom->getElementsByTagName('title'); 
$title = $nodes->item(0)->nodeValue; 
 
// Parse DOM to get meta data 
$metas = $dom->getElementsByTagName('meta'); 
 
$description = $keywords = ''; 
for($i=0; $i<$metas->length; $i++){ 
    $meta = $metas->item($i); 
     
    if($meta->getAttribute('name') == 'description'){ 
        $description = $meta->getAttribute('content'); 
    } 
     
    if($meta->getAttribute('name') == 'keywords'){ 
        $keywords = $meta->getAttribute('content'); 
    } 
} 
 
echo "Title: $title". '<br/>'; 
echo "Description: $description". '<br/>'; 
echo "Keywords: $keywords"; 
 
?>
the end

</body>
</html>