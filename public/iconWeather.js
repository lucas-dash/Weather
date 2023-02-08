export const iconMap = new Map();
addMapping([0, 1], "sun"); // || moon
addMapping([2], "cloud-sunny");
addMapping([3], "cloud");
addMapping([45, 48], "cloud-fog");
addMapping([51, 53, 55, 61, 63, 65, 80, 81, 82], "cloud-drizzle");
addMapping([71, 73, 75], "snow");
addMapping([56, 57, 66, 67, 77, 85, 86], "cloud-snow");
addMapping([95, 96, 99], "cloud-lightning");
function addMapping(values, icon) {
    values.forEach((value) => {
        iconMap.set(value, icon);
    });
}
