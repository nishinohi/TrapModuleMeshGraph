const KEY_WORK_TIME = 'work_time';
const KEY_TRAP_MODE = 'trap_mode';
const KEY_NODE_ID = 'module_id';
const KEY_NODE_LIST = 'node_list';
const KEY_CAMERA_ENABLE = 'camera';
const KEY_TRAP_FIRE = 'trap_fire';
const KEY_GPS_LAT = 'lat';
const KEY_GPS_LON = 'lon';
const KEY_MESH_GRAPH = 'mesh_graph';
const KEY_ACTIVE_START = 'active_start';
const KEY_ACTIVE_END = 'active_end';
const KEY_CURRENT_TIME = 'current_time';
const KEY_PICTURE_FORMAT = 'picture_format'

var sigmaUuid = 0;
var sigmaObj;
var sliderObj;

// 現在時刻
var timerId = -1;
var localEpoch = 0;

window.onload = function () {
    sigmaObj = new sigma({
        settings: {
            verbose: false
        },
        renderer: {
            container: 'graph-container',
            type: 'canvas'
        }
    });
    var srcMeshjson = '[{"nodeId":21423434,"subs":[{"nodeId":12345342,"subs":[]},{"nodeId":94836722,"subs":[{"nodeId":34234234,"subs":[]}]}]},{"nodeId":453424,"subs":[{"nodeId":21423434,"subs":[]},{"nodeId":5634523,"subs":[{"nodeId":98654355,"subs":[]}]}]}]';
    createMeshGraph(srcMeshjson);
}

/**
 * メッシュネットワークのjsonからsigmaJsonに変換
 * @param {*} graph 
 * @param {*} ownNodeId 
 * @param {*} meshes 
 */
function parsePainlessJson(graph, ownNodeId, meshes) {
    meshes.forEach(function (mesh) {
        if (graph.nodes(mesh.nodeId) === undefined) {
            graph.addNode({
                id: mesh.nodeId,
                label: 'Node ' + mesh.nodeId,
                x: Math.random(),
                y: Math.random(),
                size: 1,
                color: '#617db4'
            });
        }
        graph.addEdge({
            id: ++sigmaUuid,
            source: ownNodeId,
            target: mesh.nodeId,
            size: Math.random(),
            type: 't'
        });
        if (mesh.subs != null) {
            parsePainlessJson(graph, mesh.nodeId, mesh.subs);
        }
    });
    return null;
}

/**
 * メッシュネットワークグラフを作成
 * @param {*} response 
 */
function createMeshGraph(response) {
    let srcJson = JSON.parse(response);
    sigmaObj.graph.clear();
    // 最初のメッシュを作成
    let nodeId = 999999;
    sigmaObj.graph.addNode({
        id: 0,
        label: 'Node ' + nodeId,
        x: Math.random(),
        y: Math.random(),
        size: 1,
        color: '#617db4'
    });
    parsePainlessJson(sigmaObj.graph, 0, srcJson)
    sigmaObj.refresh();
    // Start the ForceAtlas2 algorithm:
    sigmaObj.startForceAtlas2();
    let autoPosition = function () {
        sigmaObj.stopForceAtlas2();
    };
    setTimeout(autoPosition, 2500);
    let dragListener = sigma.plugins.dragNodes(sigmaObj, sigmaObj.renderers[0]);
}
