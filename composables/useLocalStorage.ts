// Utility function to handle localStorage operations safely
const useLocalStorage = (key: string, initialValue: any) => {
  const storedValue = ref(initialValue);

  const setValue = (value: any) => {
    storedValue.value = value;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn("LocalStorage is not available.", e);
    }
  };

  // Retrieve the initial value from localStorage
  onMounted(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
          storedValue.value = JSON.parse(item);
        }
      }
    } catch (e) {
      console.warn("Error accessing localStorage.", e);
    }
  });

  // Watch for changes and update localStorage
  watch(storedValue, (newValue) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (e) {
      console.warn("LocalStorage is not available.", e);
    }
  });

  return { storedValue, setValue };
};

export default useLocalStorage;