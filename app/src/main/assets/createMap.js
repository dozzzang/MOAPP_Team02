function initMap() {
  // OpenLayers 지도 초기화
  const map = new ol.Map({
    target: "vmap",
    view: new ol.View({
      zoom: 15, // 기본 줌 레벨을 15로 설정
    }),
    interactions: ol.interaction.defaults().extend([
      new ol.interaction.MouseWheelZoom(), // 마우스 스크롤 확대/축소 활성화
    ]),
    layers: [
      // 기본 VWorld 배경지도 레이어
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: "https://xdworld.vworld.kr/2d/Base/202002/{z}/{x}/{y}.png",
        }),
      }),
    ],
  });
  // WMS 레이어 저장 객체
  const overlayLayers = {
    모두보기: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Tot",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: true, // 기본적으로 활성화
    }),
    강도: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Brglr",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: false,
    }),
    절도: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Theft",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: false,
    }),
    성폭력: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Violn",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: false,
    }),
  };

  // 지도에 오버레이 레이어 추가
  Object.values(overlayLayers).forEach((layer) => map.addLayer(layer));

  // 레이어 선택 UI 추가
  function addLayerControl() {
    const controlContainer = document.createElement("div");
    controlContainer.id = "layer-control";
    controlContainer.style.position = "absolute";
    controlContainer.style.top = "10px";
    controlContainer.style.right = "10px";
    controlContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    controlContainer.style.padding = "10px";
    controlContainer.style.borderRadius = "5px";
    controlContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    controlContainer.innerHTML = `
      <h3 style="margin = 0;">지도에 표시할 빈도 항목을 선택</h3>
      <div>
        <label>
          <input type="checkbox" id="overlay-all" checked /> 모두보기
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="overlay-brglr" /> 강도
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="overlay-theft" /> 절도
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="overlay-violn" /> 성폭력
        </label>
      </div>
    `;

    document.body.appendChild(controlContainer);

    // 이벤트 리스너 추가
    const allCheckbox = document.getElementById("overlay-all");
    const brglrCheckbox = document.getElementById("overlay-brglr");
    const theftCheckbox = document.getElementById("overlay-theft");
    const violnCheckbox = document.getElementById("overlay-violn");

    // "모두보기" 체크박스 동작
    allCheckbox.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      Object.keys(overlayLayers).forEach((key) => {
        overlayLayers[key].setVisible(isChecked);
        if (key !== "모두보기") {
          document.getElementById(`overlay-${key}`).checked = isChecked;
        }
      });
    });

    // 개별 항목 체크박스 동작
    brglrCheckbox.addEventListener("change", (event) => {
      overlayLayers["강도"].setVisible(event.target.checked);
      if (!event.target.checked) allCheckbox.checked = false; // 모두보기 해제
    });

    theftCheckbox.addEventListener("change", (event) => {
      overlayLayers["절도"].setVisible(event.target.checked);
      if (!event.target.checked) allCheckbox.checked = false; // 모두보기 해제
    });

    violnCheckbox.addEventListener("change", (event) => {
      overlayLayers["성폭력"].setVisible(event.target.checked);
      if (!event.target.checked) allCheckbox.checked = false; // 모두보기 해제
    });
  }

  // 레이어 컨트롤 UI 호출
  addLayerControl();

  // 현재 위치 기반으로 지도를 이동시키는 함수
  function setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = ol.proj.fromLonLat([longitude, latitude]);
          map.getView().setCenter(coords); // 지도 중심을 현재 위치로 이동
          map.getView().setZoom(15); // 줌 레벨 설정
        },
        (error) => {
          console.error(`[ERROR] Geolocation failed: ${error.message}`);
          alert("현재 위치를 가져올 수 없습니다.");
        }
      );
    } else {
      console.error("[ERROR] Geolocation is not supported by this browser.");
      alert("브라우저가 현재 위치 기능을 지원하지 않습니다.");
    }
  }

  // "현재 위치로 이동" 버튼 생성 및 이벤트 추가
  function addCurrentLocationButton() {
    const button = document.createElement("button");
    button.innerHTML = `<img src="https://img.icons8.com/ios-filled/50/000000/marker.png" alt="현재 위치" style="width: 20px; height: 20px; vertical-align: middle;" />`;
    button.title = "현재 위치로 이동";
    button.style.position = "absolute";
    button.style.bottom = "20px";
    button.style.right = "10px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.backgroundColor = "white";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "50%";
    button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.cursor = "pointer";
    button.style.zIndex = 1000;

    button.onclick = setCurrentLocation;

    document.body.appendChild(button);
  }
  // 범례 데이터를 XML에서 로드하는 함수
  function loadLegend(layer, style) {
    const apiKey = "TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O";

    // 프록시 서버 URL을 사용
    const proxyUrl = `http://10.0.2.2:3000/proxy`; // Node.js 프록시 서버
    const targetUrl = `http://www.safemap.go.kr/legend/legendApiXml.do?apikey=${apiKey}&layer=${layer}&style=${style}`;
    const url = `${proxyUrl}?url=${encodeURIComponent(targetUrl)}`;

    fetch(url)
      .then((response) => {
        console.log(`[DEBUG] Fetch response status: ${response.status}`);
        if (!response.ok) throw new Error("Failed to fetch legend data");
        return response.text();
      })
      .then((xmlString) => {
        // XML 문자열을 DOM 객체로 변환
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        // XML에서 범례 데이터를 파싱
        const legends = xmlDoc.getElementsByTagName("legend");
        const legendContent = document.getElementById("legend-content");
        legendContent.innerHTML = ""; // 기존 범례 데이터 초기화

        // 범례 데이터 추가
        for (let i = 0; i < legends.length; i++) {
          const legend = legends[i];
          const color = legend.getElementsByTagName("color")[0].textContent;
          const label = legend.getElementsByTagName("label")[0].textContent;

          const legendItem = document.createElement("div");
          legendItem.innerHTML = `
                    <span style="color: ${color};">●</span> ${label}
                `;
          legendContent.appendChild(legendItem);
        }
      })
      .catch((error) => {
        console.error(`[ERROR] Fetch failed: ${error.message}`);
      });
  }

   loadLegend("A2SM_CRMNLHSPOT_TOT", "A2SM_CrmnlHspot_Tot_Tot");

  // 맵 초기화 시 현재 위치 설정
  setCurrentLocation();

// 현재 위치 버튼 추가
  addCurrentLocationButton();

  // WMS 레이어 추가 호출
  addWMSLayer();
}
// 지도 초기화
initMap();
