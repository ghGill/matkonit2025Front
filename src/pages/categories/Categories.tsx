import './Categories.css'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { categoryType } from '../../types/types';
import api from '../../api/api';
import { useLocation } from 'wouter';
import Loader from '../../components/loader/Loader';
import { useDeviceResolution } from '../../contents/DeviceResolution';
import NavBar from '../../components/navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory, deleteCategory } from '../../store/categorySlice';
import ConfirmModal from '../../components/ConfirmModal';

function CategoriesPage() {
    const categories = useSelector((state: any) => state.categories);
    const dispatch = useDispatch();

    const [_, navigate] = useLocation();
    const [editRow, setEditRow] = useState(-1);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    let confirmData = useRef<any>({})
    const { deviceType } = useDeviceResolution();

    const loaderOn = () => {
        setShowLoader(true);
    }

    const loaderOff = () => {
        setShowLoader(false);
    }

    const editCategory = (row: number) => {
        setEditRow(row);
    }

    const removeCategoryConfirmation = async (id: number) => {
        confirmData.current = {
            msg: 'למחוק את הקטגוריה?',
            yesHandler: () => { removeCategory(id) },
        };

        setOpenConfirmModal(true);
    }

    const removeCategory = async (id: number) => {
        loaderOn();

        const result: any = await api.deleteCategory(id);

        if (result.success) {
            dispatch(deleteCategory({id}));
        }
        else {
            alert(result.message);
        }
        loaderOff();
    }

    const saveCategory = async (id: number, name: string) => {
        loaderOn();
        const result:any = await api.updateCategory(id, name);
        if (result.success) {
            dispatch(updateCategory({id, name}));
        }

        loaderOff();
    }

    const disableCategories = () => {
        setEditRow(-1);
    }

    const addNewCategory = async (e: FormEvent<HTMLFormElement>) => {
        loaderOn();
        e.preventDefault();

        const result: any = await api.addCategory(newCategoryName);

        if (result.success) {
            const newId = result.id;

            dispatch(addCategory({ id: newId, name: newCategoryName }));
            // setCategories([...categories, { id: newId, name: newCategoryName }]);

            setNewCategoryName('');
        }
        else {
            alert(result.message);
        }
        loaderOff();
    }

    const changeCategoryName = (e: ChangeEvent, id: number) => {
        dispatch(updateCategory({id, name:(e.target as HTMLInputElement).value}));
    }

    const updateNewCategoryName = (e: ChangeEvent) => {
        setNewCategoryName((e.target as HTMLInputElement).value);
    }

    const showCategoryRecipes = (e: React.MouseEvent<HTMLInputElement>, id: number) => {
        if ((e.target as HTMLInputElement).readOnly)
            navigate(`/recipes?c=${id}`);
    }

    return (
        <div className='page'>
            <NavBar current={'categories'} />

            <div className='content'>
                <div className='categories-content'>
                    {
                        openConfirmModal &&
                        <ConfirmModal
                            titleData={{ text: confirmData.current.msg, style: { fontSize: "2rem" } }}
                            yesData={
                                {
                                    text: "כן",
                                    style: { "backgroundColor": "red", "border": "none", "padding": "16px", "fontWeight": "bold" },
                                    noHover: true,
                                    actionHandler: confirmData.current.yesHandler
                                }
                            }
                            noData={
                                {
                                    text: "לא",
                                    style: { "backgroundColor": "white", "color": "black", "padding": "16px", "border": "none" }
                                }
                            }
                            closeHandler={() => { setOpenConfirmModal(false) }}
                        />
                    }

                    {
                        showLoader &&
                        <Loader fullScreen={true} />
                    }

                    <div className='add-category'>
                        <form onSubmit={addNewCategory}>
                            <label htmlFor="add-name"> קטגוריה חדשה</label>
                            <input id="add-name" type="text" value={newCategoryName} required onChange={updateNewCategoryName} />
                            <button type="submit">הוסף קטגוריה</button>
                        </form>
                    </div>

                    <div className='categories-table'>
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={2}>קטגוריה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories.filter((c: categoryType) => c.id > 0).map((c: categoryType, index: number) => (
                                        <tr key={c.id} className={`${deviceType}`}>
                                            <td className={`${deviceType}`}>
                                                <div className='actions'>
                                                    <div className='font-icon' onClick={() => { editCategory(index) }}>
                                                        <i className="fa fa-edit"></i>
                                                    </div>
                                                    <div className='font-icon' onClick={() => { saveCategory(c.id, c.name) }}>
                                                        <i className="fa fa-save"></i>
                                                    </div>
                                                    <div className='font-icon' onClick={() => { removeCategoryConfirmation(c.id) }}>
                                                        <i className="fa fa-trash"></i>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`${deviceType}`}>
                                                <input
                                                    className={`${deviceType}`}
                                                    value={c.name}
                                                    readOnly={editRow !== index}
                                                    onBlur={() => disableCategories()}
                                                    onChange={(e: ChangeEvent) => { changeCategoryName(e, c.id) }}
                                                    onClick={(e: React.MouseEvent<HTMLInputElement>) => { showCategoryRecipes(e, c.id) }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoriesPage;
