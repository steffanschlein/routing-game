export function centerContainer(container, parent) {
    container.x = parent.width / 2 - container.width / 2;
    container.y = parent.height / 2 - container.height / 2;
}

export function range(start, end) {
    let result = []
    const lower = Math.min(start, end)
    const higher = Math.max(start, end)
    for (let i = lower; i < higher; i++) {
        result.push(i)
    }
    return result
}