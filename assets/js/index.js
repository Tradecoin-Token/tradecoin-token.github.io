let assetID = document.getElementById("assetIdToSubmit").value;
let totalSupply = "";
let totalDecimals = "";
let circulatingSupply = "";
let foundationalWallet = "";
let assetIDName = "";
window.addEventListener("load", assetInformation());
window.addEventListener("load", explorer());
window.addEventListener("load", whitelist());

//Import general asset Information
function assetInformation() {
  assetID = document.getElementById("assetIdToSubmit").value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var text = this.responseText;
      var obj = JSON.parse(text);
      foundationalWallet = obj.data.sender;
      assetIDName = obj.data.name;
      var totalsupply =
        obj.data.quantity / Math.pow(10, parseInt(obj.data.precision));
      document.getElementById("totalsupply").innerHTML =
        "<strong>Total supply:</strong>" + " " + totalsupply.toLocaleString();
      document.getElementById("walletName").innerText = foundationalWallet;
      totalSupply = totalsupply;
      totalDecimals = obj.data.precision;
      circulating();
      for (
        i = 0;
        i < document.getElementsByClassName("tokenName").length;
        i++
      ) {
        document.getElementsByClassName("tokenName")[i].innerText =
          assetIDName + " ";
      }
    }
  };
  xhttp.open(
    "GET",
    "https://api.wavesplatform.com/v0/assets/EekwfLSAkbREneBHrXdZSRAEPvmijq71Nf2GDNqBStz4" + "?t=",
    true
  );
  xhttp.send();
}
//Import and calculate circulating supply
function circulating() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var text = this.responseText;
      var obj = JSON.parse(text);
      var circulating = -(
        obj.balance / Math.pow(10, parseInt(totalDecimals)) -
        totalSupply
      );
      circulatingSupply = circulating;
      document.getElementById("total").innerHTML =
        "<strong>Total circulating:</strong>" +
        " " +
        circulatingSupply.toLocaleString();
    }
  };
  xhttp.open(
    "GET",
    "https://nodes.wavesnodes.com/assets/balance/" +
      foundationalWallet +
      "/" +
      assetID +
      "?t=",
    true
  );
  xhttp.send();
}
//Import Data from Blockchain for Explorer
function explorer() {
  assetID = document.getElementById("assetIdToSubmit").value;
    $.getJSON(
      "https://api.wavesplatform.com/v0/transactions/transfer?assetId=" +
        assetID +
        "&limit=100?t=",
      function(result) {
        $('tbody#explorer').empty();
        $.each(result.data, function(key, value) {
          $("tbody#explorer").append(
            "<tr><td>" +
            value.data.timestamp.replace("T", " ").substr(0, 19) +
            " <a href='https://wavesexplorer.com/tx/" +
            value.data.id +
            "' target='_blank'><i class='fa fa-external-link' aria-hidden='true'></a></td><td>" +
            value.data.height +
            "</td><td><label class='badge  badge-info'>Transfer</label><td>" +
              value.data.sender.replace(foundationalWallet, foundationalWallet+" <label class='badge  badge-info'> Foundational</label>") +
              "</td><td>" +
              value.data.recipient +
              "</td><td>" +
              value.data.amount.toLocaleString() +
              "</td></tr>"
          );
        });
      }
    );
  };
  // Import Data from Blockchain for Whitelist
function whitelist() {
  assetID = document.getElementById("assetIdToSubmit").value;
  $.getJSON(
    "https://nodes.wavesnodes.com/assets/" + assetID + "/distribution?t=",
    function(result) {
      $('tbody#whitelist').empty();
      $.each(result, function(key, value) {
        $("tbody#whitelist").append(
          "<tr>" +
            "<td>" +
            key.replace(foundationalWallet, foundationalWallet+' <label class="badge  badge-info"><font color="#000555"> Foundational</label>') +
            "  <a href='https://wavesexplorer.com/address/" +
            key +
            "' target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></td>" +
            "<td>" +
            (value / Math.pow(10, parseInt(totalDecimals))).toLocaleString(
              "en-GB"
            ) +
            "</td>" +
            "<td>" +
            (((value / Math.pow(10, parseInt(totalDecimals))) / totalSupply)*100).toLocaleString("en-GB") +
            " %</td>" +
            "</tr>"
        );
      });
    }
  );
};
document.getElementById("clickWhitelist").addEventListener("click", function(){
  document.getElementById("clickWhitelist").style.display = "none"; 
  document.getElementById("containerExplorer").style.display = "none"; 
  document.getElementById("clickExplorer").style.display = "inline"; 
  document.getElementById("containerWhitelist").style.display = "inline"; 
  document.getElementById("containerTypeWhitelist").style.display = "inline";
  document.getElementById("containerTypeExplorer").style.display = "none";
})
document.getElementById("clickExplorer").addEventListener("click", function(){
  document.getElementById("clickWhitelist").style.display = "inline"; 
  document.getElementById("containerExplorer").style.display = "inline"; 
  document.getElementById("clickExplorer").style.display = "none"; 
  document.getElementById("containerWhitelist").style.display = "none"; 
  document.getElementById("containerTypeWhitelist").style.display = "none";
  document.getElementById("containerTypeExplorer").style.display = "inline";
})
document.getElementById("assetIdToSubmit").addEventListener("change", function(){
  assetInformation();
  whitelist();
  explorer();
})
document.getElementById("buttonSubmit").addEventListener("click", function(){
  assetInformation();
  whitelist();
  explorer();
})
