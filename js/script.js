"use strict";

import * as THREE from "three";

import { OrbitControls as e } from "three/addons/controls/OrbitControls.js";

import { ImprovedNoise as t } from "three/addons/math/ImprovedNoise.js";

import { OBJExporter as o } from "three/addons/exporters/OBJExporter.js";

import { GLTFExporter as n } from "three/addons/exporters/GLTFExporter.js";

import { GUI as r } from "three/addons/libs/lil-gui.module.min.js";

!(function () {
	function i() {
		(y = 1e3), (R = 500), (S = 3), (C = 4), (H = 5);
	}
	function a() {
		E.remove(T), T.material.dispose(), T.geometry.dispose(), d();
	}
	function d() {
		const e = (function (e, o) {
			const n = e * o;
			let r = new Uint8Array(n);
			r = Array.from(r);
			let i = new t(),
				a = 100 * Math.random(),
				d = 1;
			for (let t = 0; t < C; t++) {
				for (let t = 0; t < n; t++) {
					let o = t % e,
						n = ~~(t / e);
					r[t] += Math.abs(i.noise(o / d, n / d, a) * d);
				}
				d *= H;
			}
			let l = new THREE.Vector3(e / 2, o / 2, 0),
				s = Math.floor(Math.min(e / 2, o / 2));
			for (let t = 0; t < n; t++) {
				let o = t % e,
					n = ~~(t / e),
					i = new THREE.Vector3(o, n, 0);
				var c = Math.abs(i.distanceTo(l));
				c >= s ? (r[t] = 0) : (r[t] *= Math.cos((c / s) * (Math.PI / 2)) * S);
			}
			return r;
		})(R, R);
		(v = new THREE.PlaneGeometry(y, y, R - 1, R - 1)).rotateX(-Math.PI / 2);
		const o = v.attributes.position.array;
		let n,
			r = 0;
		for (let t = 0, i = 0, a = o.length; t < a; t++, i += 3) (n = 1 * e[t]), (o[i + 1] = n), r < n && (r = n);
		v.translate(0, -1 * S, 0), (v.attributes.position.needsUpdate = !0), v.computeVertexNormals(), v.computeBoundingBox();
		let i = {
			colorTexture: {
				value: L,
			},
			limits: {
				value: r,
			},
		};
		(b = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			onBeforeCompile: (e) => {
				(e.uniforms.colorTexture = i.colorTexture),
					(e.uniforms.limits = i.limits),
					(e.vertexShader = `\n      varying vec3 vPos;\n      ${e.vertexShader}\n    `.replace(
						"#include <fog_vertex>",
						"#include <fog_vertex>\n      vPos = vec3(position);\n      "
					)),
					(e.fragmentShader =
						`\n      uniform float limits;\n      uniform sampler2D colorTexture;\n      \n      varying vec3 vPos;\n      ${e.fragmentShader}\n    `.replace(
							"vec4 diffuseColor = vec4( diffuse, opacity );",
							"\n        float h = (vPos.y - (-limits))/(limits * 2.);\n        h = clamp(h, 0., 1.);\n        vec4 diffuseColor = texture2D(colorTexture, vec2(0, h));\n      "
						));
			},
		})),
			(T = new THREE.Mesh(v, b)),
			E.add(T);
	}
	function l() {
		c(new o().parse(E), "object.obj");
	}
	function s() {
		new n().parse(
			T,
			function (e) {
				if (e instanceof ArrayBuffer) saveArrayBuffer(e, "object.glb");
				else {
					c(JSON.stringify(e, null, 2), "object.gltf");
				}
			},
			function () {},
			{
				trs: !1,
				onlyVisible: !0,
				binary: !1,
				maxTextureSize: 4096,
			}
		);
	}
	function c(e, t) {
		!(function (e, t) {
			(M.href = URL.createObjectURL(e)), (M.download = t), M.click();
		})(
			new Blob([e], {
				type: "text/plain",
			}),
			t
		);
	}
	function m() {
		(w.aspect = window.innerWidth / window.innerHeight),
			w.updateProjectionMatrix(),
			g.setSize(window.innerWidth, window.innerHeight);
	}
	function u() {
		g.render(E, w);
	}
	let p = document.createElement("canvas"),
		f = p.getContext("2d");
	var h = f.createLinearGradient(0, p.height, 0, 0);
	h.addColorStop(0, "royalblue"),
		h.addColorStop(0.5, "royalblue"),
		h.addColorStop(0.5, "greenyellow"),
		h.addColorStop(0.55, "limegreen"),
		h.addColorStop(0.78, "peru"),
		h.addColorStop(0.9, "peru"),
		h.addColorStop(1, "white"),
		(f.fillStyle = h),
		f.fillRect(0, 0, p.width, p.height);
	let w,
		E,
		g,
		x,
		v,
		b,
		T,
		y,
		R,
		S,
		C,
		H,
		j,
		L = new THREE.CanvasTexture(p);
	i(),
		(function () {
			(j = {
				size: y,
				seg: R,
				dynamic_scale: S,
				complexity: C,
				quality_ratio: H,
				regenerate: function () {
					a(), u();
				},
				reset: function () {
					n.children[0].controllers.forEach((e) => e.setValue(e.initialValue)), i(), a(), u();
				},
				exportToObj: l,
				exportGLTF: s,
			}),
				((E = new THREE.Scene()).background = 0),
				(g = new THREE.WebGLRenderer({
					antialias: !0,
				})).setPixelRatio(window.devicePixelRatio),
				g.setSize(window.innerWidth, window.innerHeight),
				document.body.appendChild(g.domElement),
				(w = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3 * y)).position.set(
					0,
					0.5 * y,
					1 * y
				),
				w.lookAt(0, 0, 0);
			const t = new THREE.AmbientLight("white", 1);
			E.add(t);
			const o = new THREE.DirectionalLight("white", 1);
			o.position.set(0, 3, 8), E.add(o);
			const n = new r();
			let c = n.addFolder("Settings");
			c
				.add(j, "seg", 101, 800)
				.name("segment")
				.step(1)
				.onChange(function (e) {
					(R = e), a(), u();
				}),
				c.add(j, "reset").name("Reset"),
				c.add(j, "regenerate").name("Regenerate"),
				(c = n.addFolder("Export")).add(j, "exportToObj").name("Export OBJ (not include color)"),
				c.add(j, "exportGLTF").name("Export GLTF"),
				n.open(),
				d(),
				((x = new e(w, g.domElement)).autoRotate = !0),
				(x.autoRotateSpeed = 2),
				(x.enableDamping = !0),
				(x.enablePan = !1),
				(x.minDistance = 0.1),
				(x.maxDistance = 2 * y),
				x.target.set(0, 0, 0),
				x.update(),
				window.addEventListener("resize", m);
		})(),
		(function e() {
			requestAnimationFrame(e), x.update(), u();
		})();
	const M = document.createElement("a");
	(M.style.display = "none"), document.body.appendChild(M);
})();
