// map-main.js
// Contains all main map logic from index.html

// All code from the main <script> in index.html will be moved here, except navigation module.
// This file will be included in index.html after ol.js and olms.js, before navigation.js.


// Main map logic from index.html
const key = "otszLkKLfLNHHvCXGY3n"; // Your MapTiler API Key
const styleJson = `https://api.maptiler.com/maps/base-v4/style.json?key=${key}`;
let markerLayer;

const mapStyle = {
	building: "#E9EAEA",
	road: "#FFFFF7",
	background: "#F1F4F3",
};
const attribution = new ol.control.Attribution({
	collapsible: false,
});
// Campus label data
const campusFeatures = [
	{
		name: "\nIFC-D \n(Krishan mess)",
		coord: [79.52906269520783, 17.98024784791515],
		type: "restaurant",
	},
	{
		name: "1.8k Hostel",
		coord: [79.53582781379072, 17.983770380715242],
		type: "hostel",
	},
	{
		name: "Main Admin",
		coord: [79.53078619601744, 17.98394381091049],
		type: "admin-building",
	},
	{
		name: "New Academic Building",
		coord: [79.53232921856875, 17.984421120089337],
		type: "academic",
	},
	{
		name: "Library",
		coord: [79.53037447110292, 17.98441566524609],
		type: "library",
	},
	{
		name: "CSE Labs",
		coord: [79.53131957456183, 17.984301342798545],
		type: "academic",
	},
	{
		name: "CSE Dept",
		coord: [79.53161321822243, 17.983856593675753],
		type: "academic",
	},
	{
		name: "1k Hostel Building",
		coord: [79.53443231896347, 17.98290639599844],
		type: "hostel",
	},
	{
		name: "Stadium",
		coord: [79.53301896164895, 17.980629556673392],
		type: "stadium",
	},
	{
		name: "Ambedkar Learning Center",
		coord: [79.52924697180664, 17.98454417640646],
		type: "hall",
	},
	{
		name: "Super Mart",
		coord: [79.53010739320175, 17.985013141135823],
		type: "shop",
	},
	{
		name: "Nestle Coffee",
		coord: [79.52983474650804, 17.984264080802276],
		type: "cafe",
	},
	{
		name: "Main Auditorium",
		coord: [79.52900379818784, 17.98400793348995],
		type: "hall",
	},
	{
		name: "Seminar Hall",
		coord: [79.52978485740394, 17.983601972860612],
		type: "hall",
	},
	{
		name: "Gym",
		coord: [79.53240694015516, 17.982845204429182],
		type: "gym",
	},
	{
		name: "Madras Cafe",
		coord: [79.5328343867823, 17.984179575776338],
		type: "cafe",
	},
	{
		name: "Cake and Cafe",
		coord: [79.53567471205139, 17.984212215714066],
		type: "cafe",
	},
];

let routingMode = false;

// Call this function when user wants to pick locations manually
function enableRoutingMode() {
	routingMode = true;
	console.log("Routing mode enabled — click on map to pick points.");
}

// Disable after route is selected
function disableRoutingMode() {
	routingMode = false;
	console.log("Routing mode disabled.");
}

const map = new ol.Map({
	target: "map",
	controls: ol.control.defaults
		.defaults({ attribution: false })
		.extend([attribution]),
	view: new ol.View({
		constrainResolution: true,
		center: ol.proj.fromLonLat([79.53084932512772, 17.983676053176477]), // Center of the campus
		zoom: 18,
		minZoom: 17,
		rotation: 78.53,
	}),
});

fetch(styleJson)
	.then((response) => response.json())
	.then((style) => {
		style.layers.forEach((layer) => {
			if (layer.type === "fill-extrusion") {
				layer.paint["fill-extrusion-color"] = mapStyle.building;
			}

			if (
				layer.type === "fill" &&
				layer.id.toLowerCase().includes("building")
			) {
				layer.paint["fill-color"] = mapStyle.building;
			}

			if (
				layer.type === "line" &&
				layer.id.toLowerCase().includes("road")
			) {
				layer.paint["line-color"] = mapStyle.road;
			}

			if (layer.type === "background") {
				layer.paint["background-color"] = mapStyle.background;
			}
		});

		olms.apply(map, style).then(() => {
			// Convert to ol.Features
			const features = campusFeatures.map(
				(f) =>
					new ol.Feature({
						geometry: new ol.geom.Point(ol.proj.fromLonLat(f.coord)),
						name: f.name,
						type: f.type,
					})
			);
			console.log(features);

			// Function to create a vector layer
			function createCampusLayer(features, filterType) {
				const filteredFeatures = features.filter(
					(f) => f.get("type") === filterType
				);

				return new ol.layer.Vector({
					source: new ol.source.Vector({ features: filteredFeatures }),
					style: (f) => {
						const featureType = f.get("type");

						// Set icon based on feature type
						let iconUrl;
						try {
							iconUrl = "./icons/" + featureType + ".svg";
						} catch (e) {
							iconUrl = "./icons/no.svg"; // Default icon
						}

						return new ol.style.Style({
							text: new ol.style.Text({
								text: f.get("name"),
								font: "normal 12px Arial",
								fill: new ol.style.Fill({ color: "#000000" }),
								stroke: new ol.style.Stroke({
									color: "#FFFFFF",
									width: 2,
								}),
								offsetY: -15,
							}),
							image: new ol.style.Icon({
								src: iconUrl,
								scale: 0.25, // Adjust the icon size
								anchor: [0.5, 1.6], // Set the anchor for proper alignment
							}),
						});
					},
				});
			}

			// Create layers for different types
			const hostelLayer = createCampusLayer(features, "hostel");
			const academicLayer = createCampusLayer(features, "academic");
			const restaurantLayer = createCampusLayer(features, "restaurant");
			const cafeLayer = createCampusLayer(features, "cafe");
			const libraryLayer = createCampusLayer(features, "library");
			const labelLayers = {
				hostel: hostelLayer,
				academic: academicLayer,
				restaurant: restaurantLayer,
				cafe: cafeLayer,
				library: libraryLayer,
			};
			const otherTypes = ["gym", "stadium", "hall", "admin-building"];
			otherTypes.forEach((type) => {
				const layer = createCampusLayer(features, type);
				map.addLayer(layer);
				labelLayers[type] = layer;
			});

			// Add layers to the map (initially, show all layers)
			map.addLayer(hostelLayer);
			map.addLayer(academicLayer);
			map.addLayer(restaurantLayer);
			map.addLayer(cafeLayer);
			map.addLayer(libraryLayer);

			// Set initial state to show all
			let showAll = true;

			// Button functionality to toggle between showing only hostels and showing all

			Object.entries(labelLayers).forEach(([mainkey, mainvalue]) => {
				document
					.getElementById(mainkey)
					.addEventListener("click", function () {
						Object.entries(labelLayers).forEach(([key, value]) => {
							if (key != mainkey && showAll) {
								value.setVisible(false);
							} else {
								value.setVisible(true);
							}
							if (showAll != true) {
								value.setVisible(true);
							}
						});
						showAll = !showAll; // Toggle the state
					});
			});
		});

		// --- Live user location (controlled by user action)
		let userHeading = 0;
		let userMarkerLayer;
		let liveTrackingWatchId = null;
		// last known user coords [lon, lat]
		window.lastKnownUserCoords = null;
		// whether user explicitly enabled live tracking (via livetrack button)
		// isLiveTrackingEnabled: true = marker updates happen (opt-in)
		// isLiveFollow: true = map recenters on every update (follow mode)
		window.isLiveTrackingEnabled = false;
		window.isLiveFollow = false;
		// internal flag to ensure we center once when live-tracking is started
		window._liveTrackingDidInitialCenter = false;

		// Device orientation (for heading)
		function handleOrientation(event) {
			if (event.alpha != null) {
				userHeading = event.alpha;
				// console.log("User heading:", userHeading);
			}
		}

		function enableDeviceOrientation() {
			if (window.DeviceOrientationEvent) {
				if (typeof DeviceOrientationEvent.requestPermission === "function") {
					DeviceOrientationEvent.requestPermission().then((response) => {
						if (response === "granted") {
							window.addEventListener("deviceorientationabsolute", handleOrientation);
						}
					});
				} else {
					window.addEventListener("deviceorientationabsolute", handleOrientation);
				}
			}
		}

		// Function to update user marker on map
		function updateUserLocation(lon, lat) {
			const coords3857 = ol.proj.fromLonLat([lon, lat]);
			// store last known coords for quick access elsewhere
			window.lastKnownUserCoords = [lon, lat];
			if (userMarkerLayer) {
				map.removeLayer(userMarkerLayer);
			}
			const userMarker = new ol.Feature({
				geometry: new ol.geom.Point(coords3857),
			});
			userMarkerLayer = new ol.layer.Vector({
				source: new ol.source.Vector({ features: [userMarker] }),
				style: new ol.style.Style({
					image: new ol.style.Icon({
						src: "icons/live-marker.svg",
						scale: 1,
						anchor: [0.5, 1],
						rotation: (-userHeading * Math.PI) / 180,
						rotateWithView: true,
					}),
				}),
			});
			map.addLayer(userMarkerLayer);
			// Center only when animate flag is passed, or when follow-mode is enabled
			if (arguments.length >= 3 && arguments[2] === true) {
				centerMapToCoords([lon, lat], true);
			} else if (window.isLiveFollow) {
				map.getView().setCenter(coords3857);
			}
		}

		// Smoothly center the map to given lon/lat. Set animate=false to jump.
		function centerMapToCoords(lonlat, animate = true) {
			const coords3857 = ol.proj.fromLonLat(lonlat);
			const view = map.getView();
			if (animate && view && typeof view.animate === 'function') {
				try {
					view.animate({ center: coords3857, duration: 700, easing: ol.easing.easeOut });
				} catch (e) {
					view.setCenter(coords3857);
				}
			} else {
				view.setCenter(coords3857);
			}
		}

		// Start live tracking (call this on button click)
		window.startLiveTracking = function () {
			if (!navigator.geolocation) {
				alert("Geolocation is not supported by this browser.");
				return;
			}
			// Mark tracking as enabled (user requested)
			window.isLiveTrackingEnabled = true;
			// when starting, do NOT enable continuous follow by default — we'll center once only
			window.isLiveFollow = false;
			window._liveTrackingDidInitialCenter = false;
			// If already tracking, just center the map to the latest known location
			if (liveTrackingWatchId !== null) {
				if (window.lastKnownUserCoords) {
					centerMapToCoords(window.lastKnownUserCoords, true);
					return;
				}
				// if no cached coords, try a one-time position to center (animated)
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const coords = [position.coords.longitude, position.coords.latitude];
						window.lastKnownUserCoords = coords;
						centerMapToCoords(coords, true);
					},
					(error) => {
						console.error('Geolocation error (one-time):', error);
					},
					{ enableHighAccuracy: true }
				);
				return;
			}
			enableDeviceOrientation();
			liveTrackingWatchId = navigator.geolocation.watchPosition(
					(position) => {
						const lon = position.coords.longitude;
						const lat = position.coords.latitude;
						// console.log("User location:", lon, lat);
						// center only for the very first update after starting
						if (!window._liveTrackingDidInitialCenter) {
							updateUserLocation(lon, lat, true);
							window._liveTrackingDidInitialCenter = true;
						} else {
							updateUserLocation(lon, lat, false);
						}
					},
				(error) => {
					console.error("Geolocation error:", error);
				},
				{
					enableHighAccuracy: true,
					maximumAge: 1000,
					timeout: 5000,
				}
			);
		};

		// Stop live tracking (call this on button click)
		window.stopLiveTracking = function () {
			if (liveTrackingWatchId !== null) {
				navigator.geolocation.clearWatch(liveTrackingWatchId);
				liveTrackingWatchId = null;
			}
			if (userMarkerLayer) {
				map.removeLayer(userMarkerLayer);
				userMarkerLayer = null;
			}
			// Mark tracking disabled
			window.isLiveTrackingEnabled = false;
			window.isLiveFollow = false;
			window._liveTrackingDidInitialCenter = false;
		};

		// livetrack button: first click starts live tracking; subsequent clicks center map to live location
		let trackingEnabled = false;
		document.getElementById("livetrack").addEventListener("click", function () {
			if (!trackingEnabled) {
				window.startLiveTracking();
				trackingEnabled = true;
				return;
			}
			// already enabled → center to last known location (animated) or request one-time position
			if (window.lastKnownUserCoords) {
				centerMapToCoords(window.lastKnownUserCoords, true);
			} else if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const coords = [position.coords.longitude, position.coords.latitude];
						window.lastKnownUserCoords = coords;
						centerMapToCoords(coords, true);
					},
					(error) => console.error('Geolocation error (center):', error),
					{ enableHighAccuracy: true }
				);
			}
		});

		// Optionally, keep updating heading rotation if marker is present
		function updateHeadingRotation() {
			if (userMarkerLayer) {
				userMarkerLayer
					.getSource()
					.getFeatures()[0]
					.setStyle(
						new ol.style.Style({
							image: new ol.style.Icon({
								src: "./icons/live-marker.svg",
								scale: 0.5,
								rotation: (-userHeading * Math.PI) / 180,
								rotateWithView: true,
							}),
						})
					);
			}
			requestAnimationFrame(updateHeadingRotation);
		}
		updateHeadingRotation();

		// ------------------ Socket.IO live-share helpers ------------------
		// window.requestShare(serverUrl) -> { room, senderToken, viewerToken }
		// window.startPublishingShare(serverUrl, senderToken) -> starts watch and emits 'position'
		// window.stopPublishingShare() -> stops publishing
		// window.joinShare(serverUrl, viewerToken, onPosition) -> subscribes to updates
		// window.leaveShare() -> leaves subscription
		
		window.shareSocket = null;
		window.shareViewerSocket = null;
		window.shareWatchId = null;
		let shareViewerMarkerLayer = null;

		async function requestShare(serverUrl) {
			try {
				const url = serverUrl.replace(/\/$/, '') + '/create-share';
				const r = await fetch(url, { method: 'POST' });
				if (!r.ok) throw new Error('Failed to create share');
				return await r.json();
			} catch (err) {
				console.error('requestShare error', err);
				throw err;
			}
		}

		// publish the device's position to server room using token
		window.startPublishingShare = async function (serverUrl, senderToken) {
			if (typeof io === 'undefined') {
				console.error('Socket.IO client not loaded. Add socket.io client script to the page.');
				return;
			}
			if (!senderToken) {
				// try to create a share and use returned senderToken
				const result = await requestShare(serverUrl);
				senderToken = result.senderToken;
				console.log('Created share room', result.room);
			}
			// connect socket
			window.shareSocket = io(serverUrl, { auth: { token: senderToken } });
			window.shareSocket.on('connect', () => console.log('share socket connected'));
			window.shareSocket.on('connect_error', (err) => console.error('share socket connect_error', err));

			// start geolocation watch if not already
			if (!navigator.geolocation) {
				alert('Geolocation not supported');
				return;
			}
			if (window.shareWatchId !== null) return; // already publishing
			window.shareWatchId = navigator.geolocation.watchPosition(
				(pos) => {
					const lon = pos.coords.longitude;
					const lat = pos.coords.latitude;
					// emit to server
					if (window.shareSocket && window.shareSocket.connected) {
						window.shareSocket.emit('position', { lon, lat });
					}
					// also show locally (optional): update local live marker
					updateUserLocation(lon, lat, false);
				},
				(err) => console.error('share watch error', err),
				{ enableHighAccuracy: true, maximumAge: 1000 }
			);
		};

		window.stopPublishingShare = function () {
			if (window.shareWatchId !== null) {
				navigator.geolocation.clearWatch(window.shareWatchId);
				window.shareWatchId = null;
			}
			if (window.shareSocket) {
				window.shareSocket.disconnect();
				window.shareSocket = null;
			}
		};

		function updateSharedMarker(lon, lat) {
			const coords3857 = ol.proj.fromLonLat([lon, lat]);
			if (shareViewerMarkerLayer) map.removeLayer(shareViewerMarkerLayer);
			const feat = new ol.Feature({ geometry: new ol.geom.Point(coords3857) });
			shareViewerMarkerLayer = new ol.layer.Vector({
				source: new ol.source.Vector({ features: [feat] }),
				style: new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						fill: new ol.style.Fill({ color: '#ff5c5c' }),
						stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
					})
				})
			});
			map.addLayer(shareViewerMarkerLayer);
			// optional: animate center
			centerMapToCoords([lon, lat], true);
		}

		window.joinShare = function (serverUrl, viewerToken, onPosition) {
			if (typeof io === 'undefined') {
				console.error('Socket.IO client not loaded.');
				return;
			}
			window.shareViewerSocket = io(serverUrl, { auth: { token: viewerToken } });
			window.shareViewerSocket.on('connect', () => console.log('joined share'));
			window.shareViewerSocket.on('position', (data) => {
				if (onPosition && typeof onPosition === 'function') onPosition(data);
				else updateSharedMarker(data.lon, data.lat);
			});
			window.shareViewerSocket.on('connect_error', (err) => console.error('share viewer connect_error', err));
		};

		window.leaveShare = function () {
			if (window.shareViewerSocket) {
				window.shareViewerSocket.disconnect();
				window.shareViewerSocket = null;
			}
			if (shareViewerMarkerLayer) {
				map.removeLayer(shareViewerMarkerLayer);
				shareViewerMarkerLayer = null;
			}
		};

	});

// ------------Marker Click event------------
map.on("singleclick", function (evt) {
	let feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

	// --------------------------------------
	// CASE 1: User clicked on a building marker
	// --------------------------------------
	if (feature && feature.get("name")) {
		const name = feature.get("name");

		const info = document.getElementById("infoBox");
		info.innerHTML = `
<h3 style="color:#46BD4A">${name}</h3>
<p>This is the ${name} in the campus.</p>
`;
		info.style.display = "block";

		return; // do NOT do routing
	}

	// --------------------------------------
	// CASE 2: User clicked on empty map area
	// --------------------------------------
	document.getElementById("infoBox").style.display = "none";

	// If routing mode is OFF: only show marker if you want — or do nothing
	if (!routingMode) return;

	// --------------------------------------
	// CASE 3: ROUTING MODE ACTIVE → pick source/destination
	// --------------------------------------
	const coordinate = ol.proj.toLonLat(evt.coordinate);

	// First click = source
	if (!window.routingStartPoint) {
		window.routingStartPoint = coordinate;
		console.log("Source selected:", coordinate);

		// OPTIONAL: show marker
		window.markerSource.clear();
		window.markerSource.addFeature(
			new ol.Feature({
				geometry: new ol.geom.Point(evt.coordinate),
				type: "src",
			})
		);
	}

	// Second click = destination → compute route
	else {
		const start = window.routingStartPoint;
		const end = coordinate;

		console.log("Destination selected:", end);

		window.markerSource.addFeature(
			new ol.Feature({
				geometry: new ol.geom.Point(evt.coordinate),
				type: "dst",
			})
		);

		// Compute route
		window.computeRouteByLonLat(start, end);

		// Reset for next route
		window.routingStartPoint = null;
		routingMode = false;
	}
});

// -----------Navigation Path-----------
(async function () {
	// --- CONFIG ---
	const roadsUrl = "/mnt/data/roads.geojson"; // uploaded file path (use as served URL)
	const MAX_SNAP_DISTANCE_METERS = 40; // user-chosen threshold
	const ENDPOINT_SNAP_THRESHOLD_METERS = 5; // if snapped point within 5 m of endpoint, snap to endpoint

	// --- helpers ---
	const toRad = (d) => (d * Math.PI) / 180;
	function haversine(a, b) {
		// a,b are [lon, lat]
		const R = 6371000;
		const dLat = toRad(b[1] - a[1]);
		const dLon = toRad(b[0] - a[0]);
		const A =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(a[1])) *
				Math.cos(toRad(b[1])) *
				Math.sin(dLon / 2) ** 2;
		const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
		return R * C;
	}
	// ol.sphere.getDistance is also available; we'll use haversine for internal checks.

	// --- load geojson ---
	let geo;
	try {
		const r = await fetch(roadsUrl);
		if (!r.ok) throw new Error("Failed to fetch roads geojson");
		geo = await r.json();
	} catch (err) {
		console.error("Routing: could not load roads geojson:", err);
		alert("Routing: could not load roads.geojson. See console.");
		return;
	}

	// --- Build graph: nodes and adjacency ---
	const nodeIndex = new Map(); // "lon,lat" -> idx
	const nodes = []; // idx -> [lon,lat]
	window.nodes = nodes;
	const adj = []; // idx -> [{to,weight}]

	function nodeKey(coord) {
		return coord[0] + "," + coord[1];
	}
	function addNode(coord) {
		const key = nodeKey(coord);
		if (nodeIndex.has(key)) return nodeIndex.get(key);
		const idx = nodes.length;
		nodeIndex.set(key, idx);
		nodes.push(coord);
		adj.push([]);
		return idx;
	}
	function addEdge(a, b) {
		const w = haversine(nodes[a], nodes[b]);
		// avoid duplicate edges
		if (!adj[a].some((e) => e.to === b))
			adj[a].push({ to: b, weight: w });
		if (!adj[b].some((e) => e.to === a))
			adj[b].push({ to: a, weight: w });
	}
	function removeEdgeBetween(a, b) {
		adj[a] = adj[a].filter((e) => e.to !== b);
		adj[b] = adj[b].filter((e) => e.to !== a);
	}

	// Normalize features to a list of LineStrings (handle MultiLineString)
	const rawLineStrings = [];
	(geo.features || []).forEach((feat) => {
		if (!feat.geometry) return;
		const type = feat.geometry.type;
		if (type === "LineString") {
			rawLineStrings.push(feat.geometry.coordinates);
		} else if (type === "MultiLineString") {
			(feat.geometry.coordinates || []).forEach((ls) =>
				rawLineStrings.push(ls)
			);
		}
		// ignore other types
	});

	const lineStrings = []; // each: { coords: [[lon,lat],...], nodeIndices: [...] }

	rawLineStrings.forEach((coords) => {
		const nodeIndices = [];
		for (let i = 0; i < coords.length; i++) {
			const idx = addNode(coords[i]);
			nodeIndices.push(idx);
			if (i > 0) addEdge(nodeIndices[i - 1], nodeIndices[i]);
		}
		lineStrings.push({ coords: coords.slice(), nodeIndices });
	});

	if (nodes.length === 0) {
		alert("Routing: no LineStrings found in geojson.");
		return;
	}

	// --- Nearest point-on-network logic ---
	// Returns object: { closestPoint:[lon,lat], distMeters, lineIndex, segIndex, isVertex, vertexIdx }
	function findNearestPointOnNetwork(lonlat) {
		let best = {
			distMeters: Infinity,
			closestPoint: null,
			lineIndex: -1,
			segIndex: -1,
			isVertex: false,
			vertexIdx: -1,
		};

		for (let li = 0; li < lineStrings.length; li++) {
			const { coords, nodeIndices } = lineStrings[li];

			// create an ol geom with coordinates in lon/lat space
			const olls = new ol.geom.LineString(coords);
			// getClosestPoint returns [lon,lat] (same coordinate space)
			const cp = olls.getClosestPoint(lonlat);

			const d = haversine(lonlat, cp);
			if (d >= best.distMeters) continue; // skip if not better

			// robust segment detection using projection method
			let foundSeg = -1;
			for (let si = 0; si < coords.length - 1; si++) {
				const A = coords[si];
				const B = coords[si + 1];
				const ABx = B[0] - A[0],
					ABy = B[1] - A[1];
				const ACx = cp[0] - A[0],
					ACy = cp[1] - A[1];
				const ab2 = ABx * ABx + ABy * ABy;
				if (ab2 === 0) continue;
				const proj = (ACx * ABx + ACy * ABy) / ab2;
				// allow small tolerance beyond [0,1]
				if (proj > -0.05 && proj < 1.05) {
					// additionally check perpendicular distance to segment (using haversine approx)
					// compute potential projected point
					const projX = A[0] + proj * ABx;
					const projY = A[1] + proj * ABy;
					const projPt = [projX, projY];
					const perpDist = haversine(cp, projPt);
					// if perpDist small enough relative to segment length, accept
					foundSeg = si;
					break;
				}
			}

			// check if cp coincides with existing vertex
			let isVertex = false,
				vertexIdx = -1;
			for (let vi = 0; vi < coords.length; vi++) {
				if (haversine(cp, coords[vi]) < 0.5) {
					// within 0.5 m => treat as vertex
					isVertex = true;
					vertexIdx = nodeIndices[vi];
					break;
				}
			}

			best = {
				distMeters: d,
				closestPoint: cp,
				lineIndex: li,
				segIndex: foundSeg,
				isVertex,
				vertexIdx,
			};
		}

		return best;
	}

	// If snapped cp is within ENDPOINT_SNAP_THRESHOLD_METERS of an existing endpoint anywhere,
	// return that endpoint node index to ensure connectivity
	function snapToExistingEndpointIfClose(cp) {
		let bestIdx = -1,
			bestD = Infinity;
		for (let i = 0; i < nodes.length; i++) {
			const d = haversine(cp, nodes[i]);
			if (d < bestD) {
				bestD = d;
				bestIdx = i;
			}
		}
		if (bestD <= ENDPOINT_SNAP_THRESHOLD_METERS)
			return { snappedToEndpoint: true, idx: bestIdx, distMeters: bestD };
		return { snappedToEndpoint: false, idx: -1, distMeters: bestD };
	}

	// Insert a temporary node for a closestInfo (if it's a middle-of-segment). Returns node index.
	function insertTempNodeAt(closestInfo) {
		if (closestInfo.isVertex) return closestInfo.vertexIdx;
		const cp = closestInfo.closestPoint;
		const li = closestInfo.lineIndex;
		const seg = closestInfo.segIndex;

		if (li < 0 || seg < 0) {
			// fallback: find nearest existing node globally
			let bestIdx = 0,
				bestD = Infinity;
			for (let i = 0; i < nodes.length; i++) {
				const d = haversine(cp, nodes[i]);
				if (d < bestD) {
					bestD = d;
					bestIdx = i;
				}
			}
			return bestIdx;
		}

		// if cp is very close to an endpoint, snap to that endpoint instead
		const endpointSnap = snapToExistingEndpointIfClose(cp);
		if (endpointSnap.snappedToEndpoint) return endpointSnap.idx;

		const line = lineStrings[li];
		const nodeA = line.nodeIndices[seg];
		const nodeB = line.nodeIndices[seg + 1];

		// create new node at cp
		const newIdx = addNode([cp[0], cp[1]]);

		// remove existing A-B edge and add A-new, new-B
		removeEdgeBetween(nodeA, nodeB);
		addEdge(nodeA, newIdx);
		addEdge(newIdx, nodeB);

		// insert into line's coords & nodeIndices to keep future snaps consistent
		line.coords.splice(seg + 1, 0, [cp[0], cp[1]]);
		line.nodeIndices.splice(seg + 1, 0, newIdx);

		return newIdx;
	}

	// Dijkstra (distance)
	function dijkstra(startIdx, endIdx) {
		const n = nodes.length;
		const dist = new Array(n).fill(Infinity);
		const prev = new Array(n).fill(null);
		const visited = new Array(n).fill(false);
		dist[startIdx] = 0;

		for (let i = 0; i < n; i++) {
			let u = -1;
			let best = Infinity;
			for (let j = 0; j < n; j++) {
				if (!visited[j] && dist[j] < best) {
					best = dist[j];
					u = j;
				}
			}
			if (u === -1) break;
			visited[u] = true;
			if (u === endIdx) break;
			for (const e of adj[u]) {
				const alt = dist[u] + e.weight;
				if (alt < dist[e.to]) {
					dist[e.to] = alt;
					prev[e.to] = u;
				}
			}
		}

		if (dist[endIdx] === Infinity) return null;
		const path = [];
		let cur = endIdx;
		while (cur !== null) {
			path.push(cur);
			cur = prev[cur];
		}
		path.reverse();
		return { path, distance: dist[endIdx] };
	}

	// --- UI layers ---
	const routeSource = new ol.source.Vector();
	const routeLayer = new ol.layer.Vector({
		source: routeSource,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({ color: "#01C72E", width: 5 }),
		}),
	});
	map.addLayer(routeLayer);

	const markerSource = new ol.source.Vector();
	window.markerSource = markerSource;
	const markerLayer = new ol.layer.Vector({
		source: markerSource,
		zIndex: 9999,
		style: function (f) {
			const t = f.get("type");
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 8,
					fill: new ol.style.Fill({
						color: t === "src" ? "#46BD4A" : "#FF5C5C",
					}),
					stroke: new ol.style.Stroke({ color: "#fff", width: 2 }),
				}),
			});
		},
	});
	map.addLayer(markerLayer);

	const infoBox = document.getElementById("infoBox");

	// --- click handlers ---
	let clickState = 0;
	let sourceNode = null;
	let destNode = null;

	function placeMarkerAtNode(idx, type) {
		// remove existing of that type
		markerSource
			.getFeatures()
			.filter((f) => f.get("type") === type)
			.forEach((f) => markerSource.removeFeature(f));
		const coord = nodes[idx];
		const feat = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
			type,
		});
		markerSource.addFeature(feat);
	}

	window.drawRouteFromIndices = function (indices, distanceMeters) {
		routeSource.clear();
		const lonlats = indices.map((i) => nodes[i]);
		const coords3857 = lonlats.map((c) => ol.proj.fromLonLat(c));

		const feat = new ol.Feature({
			geometry: new ol.geom.LineString(coords3857),
		});
		routeSource.addFeature(feat);

		if (infoBox) {
			infoBox.style.display = "block";
			infoBox.innerHTML = `<h3 style="color:#46BD4A">Route</h3>
<p>Distance: ${(distanceMeters / 1000).toFixed(3)} km (${Math.round(
				distanceMeters
			)} m)</p>
<p>Nodes: ${indices.length}</p>`;
		}
	};

	// programmatic helper
	window.computeRouteByLonLat = async function (fromLonLat, toLonLat) {
		const n1 = findNearestPointOnNetwork(fromLonLat);
		const n2 = findNearestPointOnNetwork(toLonLat);
		if (
			n1.distMeters > MAX_SNAP_DISTANCE_METERS ||
			n2.distMeters > MAX_SNAP_DISTANCE_METERS
		) {
			return { error: "one or both points too far from road network" };
		}
		const s = insertTempNodeAt(n1);
		const t = insertTempNodeAt(n2);
		const r = dijkstra(s, t);
		if (!r) return null;
		drawRouteFromIndices(r.path, r.distance);
		return r;
	};

	console.log(
		"Routing ready: 1st click sets source, 2nd click sets destination. Max snap:",
		MAX_SNAP_DISTANCE_METERS,
		"m"
	);
})();

// ----------------------Serch bar feature
// ------------------------------
// 1) Simple Geocoder (OSM Nominatim)
// ------------------------------
function geocodeAddressLocal(query) {
	query = query.toLowerCase();
	for (const f of campusFeatures) {
		if (f.name.toLowerCase().includes(query)) {
			return f.coord; // [lon, lat]
		}
	}
	return null;
}

// ------------------------------
// 2) Hook your search bars
// ------------------------------
async function computeRouteFromInputs() {
	const fromAddress = document
		.getElementById("startLocation")
		.value.trim();
	const toAddress = document
		.getElementById("destinationLocation")
		.value.trim();

	if (!fromAddress || !toAddress) return;

	// Geocode both
	const fromLonLat = geocodeAddressLocal(fromAddress);
	const toLonLat = geocodeAddressLocal(toAddress);

	if (!fromLonLat) {
		alert("Start location not found inside campus.");
		return;
	}
	if (!toLonLat) {
		alert("Destination location not found inside campus.");
		return;
	}

	// Compute route on graph
	const res = await window.computeRouteByLonLat(fromLonLat, toLonLat);

	if (!res || res.error) {
		alert("No path found between these places.");
		return;
	}

	// ---------------------------
	// 1️⃣ Always draw static route first
	// ---------------------------
	window.drawRouteFromIndices(res.path, res.distance);

	// ---------------------------
	// 2️⃣ Store for navigation mode
	// ---------------------------
	window.lastComputedRoute = res.path;

	// ---------------------------
	// 3️⃣ Show source + destination markers
	// ---------------------------
	markerSource.clear();

	markerSource.addFeature(
		new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat(fromLonLat)),
			type: "src",
		})
	);

	markerSource.addFeature(
		new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat(toLonLat)),
			type: "dst",
		})
	);

	// ---------------------------
	// Navigation confirmation popup disabled — keep it hidden
	const navConfirmBoxEl = document.getElementById("navConfirmBox");
	if (navConfirmBoxEl) navConfirmBoxEl.style.display = "none";
}

// ------------------------------
// 3) Trigger on ENTER or button
// ------------------------------
document
	.getElementById("startLocation")
	.addEventListener("keydown", (e) => {
		console.log("enter", e);
		if (e.key === "Enter") computeRouteFromInputs();
	});
document
	.getElementById("destinationLocation")
	.addEventListener("keydown", (e) => {
		console.log("enter");
		if (e.key === "Enter") computeRouteFromInputs();
	});

// Optional: add button support
const findRouteBtn = document.getElementById("findRouteBtn");
if (findRouteBtn) {
	findRouteBtn.addEventListener("click", computeRouteFromInputs);
}

document.getElementById("navStartBtn").onclick = function () {
	document.getElementById("navConfirmBox").style.display = "none";

	if (window.lastComputedRoute) {
		startTurnNavigation(window.lastComputedRoute);
	}
};

document.getElementById("navCancelBtn").onclick = function () {
	document.getElementById("navConfirmBox").style.display = "none";
};
