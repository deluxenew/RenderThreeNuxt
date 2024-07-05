import * as THREE from 'three';
import {CubeReflectionMapping, ImageLoader, MeshStandardMaterial, NearestFilter, RepeatWrapping, Vector2} from "three";
export default function () {

    const roomGroup = new THREE.Group();
    const aoMapTexture = new THREE.TextureLoader().load('plitkarepeat.jpg')

    const timesToRepeatHorizontally = 100
    const timesToRepeatVertically = 5
    aoMapTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)

    aoMapTexture.wrapS = RepeatWrapping
    aoMapTexture.wrapT = RepeatWrapping
    aoMapTexture.magFilter = NearestFilter
    const wallMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        aoMap: aoMapTexture
    })
    const wallGeometry = new THREE.PlaneGeometry(600, 30)
    const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial)
    wallLeft.position.set(-300, 15, 0)
    // wallLeft.rotateY(Math.PI / 2)
    const wallRight = new THREE.Mesh(wallGeometry, wallMaterial)
    wallRight.position.set(0, 15, 300)
    wallRight.rotateY(Math.PI / 2)
    // wallRight.rotateZ(Math.PI / 2)
    // wallLeft.rotateX(Math.PI / 2)

    roomGroup.add(wallLeft)
    roomGroup.add(wallRight)
 return roomGroup
}
