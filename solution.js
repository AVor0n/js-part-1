async function getDataAsync(url) {
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
    throw new Error(`Ошибка HTTP: ${response.status}`);
}

// Функция для получения данных о стране по коду cca3
async function getCountryData(code) {
    const url = `https://restcountries.com/v3.1/alpha/${code}?fields=name&fields=borders`;
    try {
        const countryData = await getDataAsync(url);
        return countryData;
    } catch (error) {
        throw new Error(`Ошибка при получении данных о стране: ${error.message}`);
    }
}

export async function calculateRoute(fromCountryCode, toCountryCode) {
    let route = [];
    const visitedCountries = new Set();
    const queue = [[fromCountryCode, []]];
    let requestCount = 0;

    while (queue.length > 0) {
        const [currentCountryCode, currentPath] = queue.shift();

        if (currentCountryCode === toCountryCode) {
            route = currentPath;
            break;
        }

        if (visitedCountries.has(currentCountryCode)) {
            continue;
        }

        visitedCountries.add(currentCountryCode);

        try {
            const countryData = await getCountryData(currentCountryCode);
            const { borders } = countryData;

            for (const borderCountryCode of borders) {
                queue.push([borderCountryCode, [...currentPath, borderCountryCode]]);
            }
        } catch (error) {
            console.error(error.message);
        }

        requestCount++;
    }

    return { route, requestCount };
}
