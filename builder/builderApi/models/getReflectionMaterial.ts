import * as THREE from 'three'

export default function () {
    const textureLoader = new THREE.CubeTextureLoader()
    const texture = 'plitkarepeat.jpg'
    const urls = []
    for (let i = 0; i < 6; i++) {
        urls.push(texture)
    }
    const textureEquirec = textureLoader.load(urls)
    textureEquirec.mapping = THREE.CubeUVReflectionMapping
    // textureEquirec.encoding = THREE.sRGBEncoding
    return new THREE.MeshLambertMaterial({
        // color: 0xdddddd,
        envMap: textureEquirec,

    })
}
