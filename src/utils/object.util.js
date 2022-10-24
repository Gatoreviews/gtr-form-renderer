export const removeNullFromObject = obj => {
  Object.keys(obj).forEach(key => {
    if ((Array.isArray(obj[key]) && obj[key].length === 0) || obj[key] === null) {
      delete obj[key]
    }
  })
  return obj
}

export const parseSteps = steps => {
  return steps.map(step => getSlugRecursif(step.elements))
}

function getSlugRecursif(currentElements) {
  const slugsArray = []

  currentElements.forEach(currentElement => {
    if (currentElement.type === 'field') {
      slugsArray.push(currentElement.slug)
    }

    // iterate on gridElement if type is grid
    if (currentElement.type === 'grid') {
      const gridItemElements = currentElement.gridItems?.reduce((elements, gridItem) => {
        elements.push(...gridItem.elements)
        return elements
      }, [])

      slugsArray.push(...getSlugRecursif(gridItemElements))
    }
  })

  return slugsArray
}
