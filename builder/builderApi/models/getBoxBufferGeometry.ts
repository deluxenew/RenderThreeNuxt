import {
    Mesh,
    MeshStandardMaterial,
    BufferAttribute,
    BufferGeometry,
    TextureLoader,
    MathUtils,
    MeshLambertMaterial
} from "three";

export default function () {

    const sw = 0
    const sh = 0
    const w = 2.15
    const h = 3.6


    const deltaW = 0.42

    const sw2 = w + deltaW
    const w2 = sw2 + w

    const sw3 = w2 + deltaW
    const w3 = sw3 + w
    console.log(w, w2, w3)

    const vertices = [
        { pos: [sw, 0, h], norm: [0, 1, 0], uv: [0, 1] }, // A
        { pos: [w , 0, h], norm: [0, 1, 0], uv: [0.3, 1] }, // B
        { pos: [w, 0, sh], norm: [0, 1, 0], uv: [0.3, 0] }, // C

        { pos: [w, 0, sh], norm: [0, 1, 0], uv: [0.3, 0] }, // C
        { pos: [sw , 0, sh], norm: [0, 1, 0], uv: [0, 0 ] }, // D
        { pos: [sw, 0, h], norm: [0, 1, 0], uv: [0, 1] }, // A

        { pos: [sw2, 0, h], norm: [0, 1, 0], uv: [0.33, 1] }, // A2
        { pos: [w2 , 0, h], norm: [0, 1, 0], uv: [0.66, 1] }, // B2
        { pos: [w2, 0, 0], norm: [0, 1, 0], uv: [0.66, 0] }, // C2

        { pos: [w2, 0, 0], norm: [0, 1, 0], uv: [0.66, 0] }, // C2
        { pos: [sw2 , 0, 0], norm: [0, 1, 0], uv: [0.33, 0 ] }, // D2
        { pos: [sw2, 0, h], norm: [0, 1, 0], uv: [0.33, 1] }, // A2

        { pos: [sw3, 0, h], norm: [0, 1, 0], uv: [0.7, 1] }, // A2
        { pos: [w3 , 0, h], norm: [0, 1, 0], uv: [1, 1] }, // B2
        { pos: [w3, 0, 0], norm: [0, 1, 0], uv: [1, 0] }, // C2

        { pos: [w3, 0, 0], norm: [0, 1, 0], uv: [1, 0] }, // C2
        { pos: [sw3 , 0, 0], norm: [0, 1, 0], uv: [0.7, 0 ] }, // D2
        { pos: [sw3, 0, h], norm: [0, 1, 0], uv: [0.7, 1] }, // A2
    ]

    const positions = []
    const normals = []
    const uvs = []
    for (const vertex of vertices) {
        positions.push(...vertex.pos)
        normals.push(...vertex.norm)
        uvs.push(...vertex.uv)
    }
    const geometry = new BufferGeometry()
    const positionNumComponents = 3
    const normalNumComponents = 3
    const uvNumComponents = 2
    geometry.setAttribute(
        'position',
        new BufferAttribute(new Float32Array(positions), positionNumComponents)
    )
    geometry.setAttribute(
        'normal',
        new BufferAttribute(new Float32Array(normals), normalNumComponents)
    )
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), uvNumComponents))
    const loader = new TextureLoader()


    const texture = loader.load('gorod.jpg')
    console.log(texture)
                        const newMaterial = new MeshLambertMaterial({
                            emissiveMap: texture,
                            emissive: 0xffffff,
                            emissiveIntensity: 6,
                            // blendColor: 0xffffff,
                            // color: 0xffffff,
                            // map: texture,
                            // transparent: true,
                            // opacity: 0.99
                            })



    const sideBottom = new Mesh(geometry, newMaterial)

    sideBottom.position.set(3.65,1.05,-4.052)
    sideBottom.rotateX(MathUtils.degToRad(90))
    sideBottom.rotateY(MathUtils.degToRad(180))
    // sideBottom.rotateY(MathUtils.degToRad(-45))
    return sideBottom
}
