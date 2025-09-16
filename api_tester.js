document.addEventListener("DOMContentLoaded", () => {
  const savedSubdomain = localStorage.getItem("subdomain");
  const savedApiKey = localStorage.getItem("apiKey");

  if (savedSubdomain) {
    document.getElementById("subdomain").value = savedSubdomain;
  }
  if (savedApiKey) {
    document.getElementById("apiKey").value = savedApiKey;
  }

  document.getElementById("type").addEventListener("change", (event) => {
    const bodyField = document.getElementById("json-input");
    if (event.target.value === "PUT" || event.target.value === "POST") {
      bodyField.style.display = "block";
    } else {
      bodyField.style.display = "none";
      bodyField.value = "";
    }
  });


  document.getElementById("preset").addEventListener("change", (event) => {
    const jsonInputDiv = document.getElementById("json-input");
    const bodyField = document.getElementById("body");
    const typeField = document.getElementById("type");
    const uriField = document.getElementById("uri");

    function showBodyField(text) {
      jsonInputDiv.style.display = "block";
      //bodyField.style.display = "block";
      bodyField.value = text;
    }

    function hideBodyField() {
      jsonInputDiv.style.display = "none";
      //bodyField.style.display = "none";
      bodyField.value = "";
    }
    switch (event.target.value) {
      case "list-activities":
        typeField.value = "GET";
        uriField.value = "/activities";
        hideBodyField();
        break;
      case "list-custom_field_groups":
        typeField.value = "GET";
        uriField.value = "/custom_field_groups";
        hideBodyField();
        break;
      case "list-custom_fields":
        typeField.value = "GET";
        uriField.value = "/custom_fields";
        hideBodyField();
        break;
      case "list-inspections":
        typeField.value = "GET";
        uriField.value = "/inspections";
        hideBodyField();
        break; 
      case "list-inspection_results":
        typeField.value = "GET";
        uriField.value = "/inspection_results";
        hideBodyField();
        break;
      case "list-opportunities":
        typeField.value = "GET";
        uriField.value = "/opportunities";
        hideBodyField();
        break;
      case "list-products":
        typeField.value = "GET";
        uriField.value = "/products";
        hideBodyField();
        break;
      case "list-members":
        typeField.value = "GET";
        uriField.value = "/members";
        hideBodyField();
        break;
      case "list-webhooks":
        typeField.value = "GET";
        uriField.value = "/webhooks";
        hideBodyField();
        break;
      case "list-opportunity_items":
        typeField.value = "GET";
        uriField.value = "/opportunities/X/opportunity_items";
        hideBodyField();
        uriField.focus();
        uriField.setSelectionRange(15, 16);
        break;
      case "create-webhook":
        typeField.value = "POST";
        uriField.value = "/webhooks";
        showBodyField(`{
        "webhook": {
          "name":"My Webhook",
          "event":"item_action",
          "target_url":"https://mywebhook.com/handler",
          "active":true
          }
        }`);
        break;
      case "delete-webhook":
        typeField.value = "DELETE";
        uriField.value = "/webhooks/X";
        hideBodyField();
        uriField.focus();
        uriField.setSelectionRange(10, 11);
        break;
      case "create-discussion":
        typeField.value = "POST";
        uriField.value = "/discussions";
        showBodyField(`{
          "discussion": {
          "discussable_id": X,
          "discussable_type": "Opportunity",
          "subject": "Discussion subject",
          "first_comment": {
            "remark": "First remark in the discussion",
            "created_by": 71
          },
          "participants": [
            {
              "member_id": 71,
              "mute": false
            }
          ],
          "created_by": 71
          }
        }`);
        uriField.focus();
        uriField.setSelectionRange(15, 16);
        break;
      case "list-discussions":
        typeField.value = "GET";
        uriField.value = "/discussions";
        hideBodyField();
        break;
      }

  });

  document.getElementById("send").addEventListener("click", async () => {

    const startTime = Date.now();

    const subdomain = document.getElementById("subdomain").value;
    const apiKey = document.getElementById("apiKey").value;
    const type = document.getElementById("type").value;
    const uri = document.getElementById("uri").value;
    const body = document.getElementById("body").value;
    const responseDiv = document.getElementById("response");

    responseDiv.textContent = `Sending ${type} request to ${uri}...`;

    localStorage.setItem("subdomain", subdomain);
    localStorage.setItem("apiKey", apiKey);

    if (!subdomain || !apiKey || !uri) {
      responseDiv.textContent = "Please fill in all fields.";
      return;
    }

    const url = `https://api.current-rms.com/api/v1${uri}`;

    const fetchOptions = {
      method: type,
      headers: {
        "X-SUBDOMAIN": subdomain,
        "X-AUTH-TOKEN": apiKey,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    };

    if (type === "PUT" || type === "POST") {
      try {
        fetchOptions.body = JSON.stringify(JSON.parse(body));
      } catch (error) {
        console.error(fetchOptions.body);
        responseDiv.textContent = "Invalid JSON in Request Body.", fetchOptions.body;
        return;
      }
    }
    

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        responseDiv.innerHTML = `<pre>Error ${response.status}: ${response.statusText}\n${errorText}</pre>`;
        return;
      }

      const data = await response.json();
      const endTime = Date.now();
      const duration = endTime - startTime;


      if (response.status === 200){
      responseDiv.innerHTML = `<pre>Response after ${duration}ms: <br>${JSON.stringify(data, null, 2)}</pre>`;
      } else {
        responseDiv.innerHTML = `<pre>Response after ${duration}ms: <br>OK</pre>`;
      }
    } catch (error) {
      responseDiv.textContent = `Error: ${error.message}. Response Status Text: ${response.statusText}`;
    }
  });
});

  