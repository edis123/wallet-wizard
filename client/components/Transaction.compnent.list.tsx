import React from "react";
import { fetchMethod } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { moneyMethods } from "@/lib/money";
import Title from "./Title.component";
import NavBar from "./NavBar.component";


//defining tyypes for facilitation and usage
type Direction = "INCOME" | "EXPENSE";
type CategoryType = "INCOME" | "EXPENSE";
type Category = { id: string; name: string; type: CategoryType };
type Props = { categoryList: Category[]; loadCategories: () => Promise<void> }; // use props to get the datae from parent
type Transaction = {
  id: string;
  amountCents: number;
  direction: Direction;
  currency: string;
  date: string;
  description: string;
  category: Category | null;
};


type CELL = "ID" | "description" | "direction" | "amount" | "date" | "category"; /// helpful for typos and organization
function TransactionList({ categoryList, loadCategories }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amountToEdit, setAmountToEdit] = useState(0);
  const [directionToEdit, setDirectionToEdit] = useState<Direction>();
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [dateToEdit, setDateToEdit] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category>(); /// LOOK AT THIS ONE
  const [editCell, setEditCell] = useState<{ id: string; box: CELL } | null>(
    null,
  );
  const [creatingCategoryForRow, setCreatingCategoryForRow] = useState<
    string | null
  >(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [idToDelete, setIDtoDelete] = useState("");
  const [userName, setUserName]= useState("")
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const filteredCat = useMemo(() => {
    return (categoryList ?? []).filter((c) => c.type === directionToEdit);
  }, [categoryList, directionToEdit]);

  async function showList() {
    setBusy(true);
    setError("");

    try {
      const data = await fetchMethod.fetching("/api/transactions", {
        method: "GET",
      });

      setTransactions(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to LOAD Transaction!");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(tr: Transaction, box: CELL) {
    setError("");

    setEditCell({ id: tr.id, box });

    switch (box) {
      case "ID":
        setIDtoDelete(tr.id);
        break;

      case "description":
        setDescriptionEdit(tr.description);
        break;
      case "amount":
        const result = tr.amountCents;
        setAmountToEdit(result);
        break;
      case "direction":
        setDirectionToEdit(tr.direction);
        break;

      case "date":
        setDateToEdit(tr.date.slice(0, 10));
        break;

      case "category":
        setDirectionToEdit(tr.direction);
        setCategoryToEdit(tr.category ?? undefined);
        break;
    }
  }

  function cancelEdit(box: CELL) {
    setError("");
    setEditCell(null);
    switch (box) {
      case "ID":
        setIDtoDelete("");
        break;
      case "description":
        setDescriptionEdit("");
        break;
      case "amount":
        setAmountToEdit(0);
        break;
      case "direction":
        setDirectionToEdit("EXPENSE");
        break;

      case "date":
        setDateToEdit("");
        break;

      case "category":
        setCategoryToEdit({ id: "", name: "", type: "EXPENSE" });
        break;
    }
  }

  async function saveEdit(id: string, box: CELL) {
    const payload: Record<string, unknown> = {}; /// creating a payload of any kind for put call

    switch (box) {
      case "description": {
        if (!descriptionEdit) {
          setError("Insert Description!!!");
          return;
        }

        payload.description = descriptionEdit.trim();
        break;
      }
      case "amount": {
        if (!amountToEdit) {
          setError("Insert Amount!!!");
          return;
        }
        payload.amountCents = Math.round(amountToEdit);

        break;
      }
      case "direction":
        payload.direction = directionToEdit;
        break;

      case "date":
        payload.date = new Date(dateToEdit).toISOString().trim();
        break;

      case "category":
        payload.categoryId = categoryToEdit?.id || null;
        break;

      default: {
        setError("Unknown field");
        return;
      }
    }

    setBusy(true);
    setError("");

    try {
      const updated = await fetchMethod.fetching(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

    const {userId} = updated
      console.log("this is : ",userId)
      // const userData = await fetchMethod.fetching(`/api/accounts/${updated.userId}`,{
      //   method:"GET"
      // })

      // setUserName(userData.email);
      setTransactions(
        (prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)), ///reorganize list
      );
      cancelEdit(box);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("failed to update Description");
    } finally {
      setBusy(false);
    }
  }

  async function softDelete(id: string) {
    setBusy(true);
    setError("");
    try {
      await fetchMethod.fetching(`/api/transactions/${idToDelete}`, {
        method: "DELETE",
      });

      setTransactions((prev) => prev.filter((t) => t.id !== idToDelete));
      setEditCell(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("failed to DELETE transaction");
    } finally {
      setBusy(false);
    }
  }

  async function createTransaction() {
    setBusy(true);
    setError("");

    const payload = {
      description: "New transaction",
      amountCents: 0,
      direction: "EXPENSE",
      categoryId: null,
      date: new Date().toISOString(),
      currency: "USD",
    };

    try {
      const newTransaction = await fetchMethod.fetching("/api/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("failed to DELETE transaction");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    showList();
  }, []);

  if (busy && transactions.length === 0)
    return <div>LOADING TRANSACTION....</div>;

  return (
    <div className="min-h-screen bg-sky-900 p-6 font-sans sepia-30">
    
      <div className="max-w-6xl mx-auto space-y-6 bg-sky-900">
        <div className=" bg-orange-400 rounded-2xl shadow p-6 flex items-center justify-center sepia">
            <div className="bg-orange-100 rounded-2xl shadow p-9 w-4xl">
           <Title/>
            <p className="text-gray-500  flex items-center justify-center">Managment Tool</p>
              {/* <p className="text-gray-500  flex items-center justify-center">{userName}</p> */}
          </div>
          <NavBar/>
        </div>

        <div className="bg-mauve-700 rounded-2xl shadow-2xl p-4 border border-orange-400 border-6 sepia-40">
          <table className="table-container  w-full bg-gray-300 ">
            <thead className="bg-gray-100 ">
              <tr className="bg-gray-100 text-lg font-bold border-3  ">
                <th className="border border-gray-400 p-2">ID</th>
                <th className="border border-gray-400 p-2">Description</th>
                <th className="border border-gray-400 p-2">Amount</th>
                <th className="border border-gray-400 p-2">Currency</th>
                <th className="border border-gray-400 p-2">Direction</th>
                <th className="border border-gray-400 p-2">Category</th>
                <th className="border border-gray-400 p-2">Date</th>
              </tr>
            </thead>

            <tbody className="rounded-lg">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-orange-400 border-2">
                  {/* ID CELL ONLY FOR SOFTDELETE */}
                  <td
                    className="border border-gray-500 p-2 cursor-pointer"
                    onDoubleClick={() => startEdit(t, "ID")}
                    title="Double click to DELETE"
                  >
                    {editCell?.id === t.id && editCell?.box === "ID" ? (
                      <input
                        className="w-full border rounded p-1"
                        placeholder="PRESS ENTER TO DELETE"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") softDelete(t.id);
                          if (e.key === "Escape") cancelEdit("ID");
                        }}
                        autoFocus
                      />
                    ) : (
                      t.id
                    )}
                  </td>

                  {/* DESCRIPTION CELL */}
                  <td
                    className="border border-gray-500 p-2 cursor-pointer"
                    onDoubleClick={() => startEdit(t, "description")}
                    title="Double click to edit"
                  >
                    {editCell?.id === t.id &&
                    editCell?.box === "description" ? (
                      <div className="space-y-1">
                        <input
                          className="w-full border rounded p-1"
                          value={descriptionEdit}
                          onChange={(e) => setDescriptionEdit(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              saveEdit(t.id, "description");
                            if (e.key === "Escape") cancelEdit("description");
                          }}
                          autoFocus
                        />
                        <div className="flex items-center gap-2 text-xs">
                          {error && <div className="text-red-600">{error}</div>}
                        </div>
                      </div>
                    ) : (
                      t.description
                    )}
                  </td>

                  <></>
                  {/* AMOUNT  CELL */}
                  <td
                    className="border border-gray-500 p-2 cursor-pointer"
                    onDoubleClick={() => startEdit(t, "amount")}
                    title="Double click to edit"
                  >
                    {editCell?.id === t.id && editCell?.box === "amount" ? (
                      <div className="space-y-1">
                        <input
                          className="w-full border rounded p-1"
                          value={amountToEdit}
                          onChange={(e) =>
                            setAmountToEdit(Number(e.target.value))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(t.id, "amount");
                            if (e.key === "Escape") cancelEdit("amount");
                          }}
                          autoFocus
                        />
                        <div className="flex items-center gap-2 text-xs">
                          {error && <div className="text-red-600">{error}</div>}
                        </div>
                      </div>
                    ) : (
                      moneyMethods.convertionToDollars(t.amountCents)
                    )}
                  </td>
                  <td
                    className={`border border-gray-500 p-2 font-semibold hoover:bg-yellow-600 ${
                      t.direction === "EXPENSE"
                        ? "text-red-600"
                        : "text-green-600 "
                    }`}
                  >
                    {t.currency}
                  </td>

                  {/* DIRECTION CELL */}
                  <td
                    className="border border-gray-500 p-2 cursor-pointer"
                    onDoubleClick={() => startEdit(t, "direction")}
                    title="Double click to edit"
                  >
                    {editCell?.id === t.id && editCell?.box === "direction" ? (
                      <select
                        className="w-full border rounded p-1"
                        value={directionToEdit}
                        onChange={(e) =>
                          setDirectionToEdit(e.target.value as Direction)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(t.id, "direction");
                          if (e.key === "Escape") cancelEdit("direction");
                        }}
                        autoFocus
                      >
                        <option value="EXPENSE">EXPENSE</option>
                        <option value="INCOME">INCOME</option>
                      </select>
                    ) : (
                      t.direction
                    )}
                  </td>

                  {/*  CATEGORY CELL */}
                  <td
                    className="border border-gray-500 p-2 cursor-pointer"
                    onDoubleClick={() => startEdit(t, "category")}
                    title="Double click to edit"
                  >
                    {editCell?.id === t.id && editCell?.box === "category" ? (
                      <div className="space-y-1">
                        <select
                          className="w-full border rounded p-1"
                          value={categoryToEdit?.id}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === "new_cat") {
                              setCreatingCategoryForRow(t.id);
                              setNewCategoryName("");
                              return;
                            }
                            const selection = filteredCat.find(
                              (c) => c.id === value,
                            );
                            setCategoryToEdit(selection);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(t.id, "category");
                            if (e.key === "Escape") cancelEdit("category");
                          }}
                          autoFocus
                        >
                          <option value="">No category</option>
                          {filteredCat.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                          <option value="new_cat">New(+)</option>
                        </select>
                        <div className="flex items-center gap-2 text-xs">
                          {error && <div className="text-red-600">{error}</div>}
                        </div>
                      </div>
                    ) : (
                      t.category?.name
                    )}
                    {/* CREATE A NEW CATEGORY INLINE FORM */}
                    {creatingCategoryForRow === t.id && (
                      <div className="mt-2 space-y-1">
                        <input
                          className="w-full border rounded p-1"
                          placeholder="New category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (async () => {
                                const created = await fetchMethod.fetching(
                                  "/api/categories",
                                  {
                                    method: "POST",
                                    body: JSON.stringify({
                                      name: newCategoryName.trim(),
                                      type: directionToEdit,
                                    }),
                                  },
                                );

                                await loadCategories(); // refresh list

                                setCategoryToEdit(created);
                                setCreatingCategoryForRow(null);
                                setNewCategoryName("");
                              })();
                            }
                            if (e.key === "Escape") {
                              setCreatingCategoryForRow(null);
                              setNewCategoryName("");
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    )}
                  </td>

                  {/* DATE CELL */}
                  <td
                    className="border border-gray-100 p-2 cursor-pointer"
                    onDoubleClick={() => startEdit(t, "date")}
                    title="Double click to edit"
                  >
                    {editCell?.id === t.id && editCell?.box === "date" ? (
                      <div className="space-y-1">
                        <input
                          type="date"
                          className="w-full border rounded p-1"
                          value={dateToEdit}
                          onChange={(e) => setDateToEdit(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(t.id, "date");
                            if (e.key === "Escape") cancelEdit("date");
                          }}
                          autoFocus
                        />
                        <div className="flex items-center gap-2 text-xs">
                          {error && <div className="text-red-600">{error}</div>}
                        </div>
                      </div>
                    ) : (
                      t.date.slice(0, 10)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="border border-gray-600 p-2 cursor-pointer rounded-sm text-white bg-gray-900 hover:bg-gray-100  hover:text-black  p-2"
            onClick={createTransaction}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
