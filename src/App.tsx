import React, { useEffect } from "react";

// 1- Render a table using the data below:

// 2- Add a button for each row to remove the row from the table

// 3- Add a form, so a user is able to fill in new data with the
// same structure above, hit a submit button and add a new row.

// 4- Sort the rows by clicking on the age table column header cell

// 5- Allow editing table cells

// 6- Fetch initial data from external source

// 7- Select multiple rows to be deleted

type UserType = {
  id: number,
  name: string,
  age: number,
  country: string
};

type Fields = 'name' | 'age' | 'country';

const getData = async () => {
  const response = await fetch('https://run.mocky.io/v3/c4f605a4-b8b5-4207-b976-ba7499ceffa0');
  try {
    const data = await response.json();
    return data.data;
  } catch(e) {
    console.log(e);
  }
}


export default function App() {
  const [internalUsers, setInternalUsers] = React.useState<UserType[]>([]);
  const [sortOrder, setSortOrder] = React.useState<string>('asc');
  const [selectedItems, setSelectedItems] = React.useState<Set<number>>(new Set);

  useEffect(() => {
    getData().then((data) => {
      setInternalUsers(data);
    }).catch((e) => {
      console.log(e);
    })
  }, [setInternalUsers]);

  const handleRemoveItem = (id: number) => {
    setInternalUsers(internalUsers.filter((item) => item.id !== id));
  };


  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const target = ev.target as typeof ev.target & {
      userName: { value: string };
      userAge: { value: number };
      userCountry: { value: string };
    };
    setInternalUsers([
      ...internalUsers,
      {
        id: Math.random(),
        name: target.userName.value,
        age: target.userAge.value,
        country: target.userCountry.value,
      },
    ]);
    const resetForm = ev.target as HTMLFormElement;
    resetForm.reset();
  };

  const handleSortByAge = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setInternalUsers(internalUsers.toSorted((a: UserType, b: UserType) => {
      if (sortOrder === 'asc') return a.age - b.age
      return b.age - a.age
    }));
  };

  const handleFieldChange = (itemId: number, field: Fields, value: string | number | null) => {
    const itemIdx = internalUsers.findIndex((item) => item.id === itemId);
    if (Object.prototype.hasOwnProperty.call(internalUsers[itemIdx], field)) {
      const tempUsers: Array<Record<string, string | number>> = [...internalUsers];
      tempUsers[itemIdx][field] = typeof value === 'string' ? value.trim() : '';
      setInternalUsers(tempUsers as UserType[]);
    }
  };

  const handleSelectItem = (itemId: number) => {
    const tempSelItems = new Set(selectedItems);
    if(selectedItems.has(itemId)) {
      tempSelItems.delete(itemId)
    } else {
      tempSelItems.add(itemId)
    }
    setSelectedItems(tempSelItems);
  }

  const handleSelectAll = () => {
    if(selectedItems.size === internalUsers.length) {
      setSelectedItems(new Set);
    } else {
      setSelectedItems(new Set(internalUsers.map(item => item.id)))
    }
  }

  return (
    <div className="App">
      <h1>Table</h1>
      {internalUsers.length ? (
        <table>
          <thead>
            <tr>
              <td>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={selectedItems.size === internalUsers.length}
                />
              </td>
              <th>Name</th>
              <th>
                Age 
                <button onClick={handleSortByAge}>{sortOrder === 'asc'? '⭣' : '⭡'}</button>
              </th>
              <th>Country</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {internalUsers.map((item) => (
              <tr key={item.id}>
                <td>
                  <input 
                    type="checkbox"
                    onChange={() => handleSelectItem(item.id)} 
                    checked={selectedItems.has(item.id)}
                  />
                </td>
                <td>
                  <span
                    contentEditable="plaintext-only"
                    suppressContentEditableWarning={true}
                    onBlur={(ev) =>
                      handleFieldChange(
                        item.id,
                        "name",
                        ev.currentTarget.textContent
                      )
                    }
                  >
                    {item.name}
                  </span>
                </td>
                <td>
                  <span
                    contentEditable="plaintext-only"
                    suppressContentEditableWarning={true}
                    onBlur={(ev) =>
                      handleFieldChange(
                        item.id,
                        "age",
                        ev.currentTarget.textContent
                      )
                    }
                  >
                    {item.age}
                  </span>
                </td>
                <td>
                  <span
                    contentEditable="plaintext-only"
                    suppressContentEditableWarning={true}
                    onBlur={(ev) =>
                      handleFieldChange(
                        item.id,
                        "country",
                        ev.currentTarget.textContent
                      )
                    }
                  >
                    {item.country}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleRemoveItem(item.id)}>-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ): (
        <div><em>Loading...</em></div>
      )}

      <form onSubmit={handleFormSubmit}>
        <fieldset>
          <label>
            Name:
            <input type="text" name="userName" required />
          </label>
        </fieldset>
        <fieldset>
          <label>
            Age:
            <input type="number" name="userAge" />
          </label>
        </fieldset>
        <fieldset>
          <label>
            Country:
            <input type="text" name="userCountry" required />
          </label>
        </fieldset>
        <button type="submit">Add new user</button>
      </form>
    </div>
  );
}
