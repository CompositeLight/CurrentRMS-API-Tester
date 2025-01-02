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

  document.getElementById("send").addEventListener("click", async () => {
    const subdomain = document.getElementById("subdomain").value;
    const apiKey = document.getElementById("apiKey").value;
    const type = document.getElementById("type").value;
    const uri = document.getElementById("uri").value;
    const body = document.getElementById("body").value;
    const responseDiv = document.getElementById("response");

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
        responseDiv.textContent = "Invalid JSON in Request Body.";
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
      responseDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      responseDiv.textContent = `Error: ${error.message}`;
    }
  });
});

  