import './recipes.css'
import type { categoryType, recipeType } from '../../types/types'
import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import api from '../../api/api';
import { imageUrl } from '../../services/env';
import Loader from '../../components/loader/Loader';
import { useDeviceResolution } from '../../contents/DeviceResolution';
import NavBar from '../../components/navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe, deleteRecipe } from '../../store/recipeSlice';
import { useLocation } from "wouter";
import ConfirmModal from '../../components/ConfirmModal';

function Section({ children }: any) {
    return (
        <div className='section'>
            {children}
        </div>
    )
}

function RecipesPage() {
    const startRecipe: any = useRef(-1);
    const startCategory: any = useRef(-1);

    const [_, setLocation] = useLocation();

    const allRecipes = useSelector((state: any) => state.recipes);
    const allCategories = useSelector((state: any) => state.categories);
    const dispatch = useDispatch();

    const [mode, setMode] = useState('list');
    const [disableFilters, setDisableFilter] = useState(false);
    const [filterCategoryId, setFilterCategoryId] = useState<number>(startCategory.current);
    const [searchRecipes, setSearchRecipes] = useState<string>('');
    const [filterRecipes, setFilterRecipes] = useState<Array<recipeType>>([]);
    const [viewRecipes, setViewRecipes] = useState<Array<recipeType>>([]);
    const [zoomImageUrl, setZoomImageUrl] = useState<string>('');
    const loaderCounter = useRef(0);
    const [showLoader, setShowLoader] = useState(true);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    let confirmData = useRef<any>({})
    const { deviceType } = useDeviceResolution();

    const emptyRecipe: recipeType =
    {
        id: -1,
        category_id: -1,
        name: '',
        ingredients: '',
        preparation: '',
        comments: '',
        image: '',
    };
    let [currentRecipe, setCurrentRecipe] = useState(emptyRecipe);

    const loaderOn = () => {
        loaderCounter.current++;

        setShowLoader(true);
    }

    const loaderOff = () => {
        loaderCounter.current > 0 ? loaderCounter.current-- : 0;

        if (loaderCounter.current <= 0)
            setShowLoader(false);
    }

    const categoryFilterChanged = (e: ChangeEvent) => {
        loaderOn();
        const catId: number = parseInt((e.target as HTMLSelectElement).value);
        setLocation(`/recipes?c=${catId}`, { replace: false })
        setFilterCategoryId(catId);
        setSearchRecipes('');
    }

    const filterRecipesByCategory = () => {
        const categoryRecipes: Array<recipeType> = allRecipes.filter((r: recipeType) => ((r.category_id === filterCategoryId) || (filterCategoryId === 0)));

        if (filterCategoryId > 0) {
            if (categoryRecipes.length === 0)
                loaderOff();
        }

        setFilterRecipes(categoryRecipes);
    }

    const searchChanged = (e: ChangeEvent) => {
        const searchText = (e.target as HTMLInputElement).value;

        setSearchRecipes(searchText);
    }

    const disableUpperPanel = (status: boolean) => {
        setDisableFilter(status);
    }

    const newRecipe = () => {
        setMode('edit');
        disableUpperPanel(true);
        setCurrentRecipe(emptyRecipe);
    }

    const editRecipe = (recipe: recipeType) => {
        setLocation(`/recipes?c=${filterCategoryId}&r=${recipe.id}`, { replace: false })
        setMode('edit');
        disableUpperPanel(true);
        setCurrentRecipe(recipe);
        loaderOff();
    }

    const updateCurrentRecipeData = (e: React.ChangeEvent<any>, prop: string) => {
        const val = e.target.value;
        setCurrentRecipe({ ...currentRecipe, [prop]: val });
    }

    const saveRecipe = async (e: any) => {
        loaderOn();

        currentRecipe = { ...currentRecipe, ['category_id']: filterCategoryId };

        e.preventDefault();

        let result: any;
        let action: string = '';

        if (currentRecipe.id > 0) {
            result = await api.updateRecipe(currentRecipe);
            action = 'edit';
        }
        else {
            result = await api.addRecipe(currentRecipe);
            action = 'add';
        }

        if (result.success) {
            currentRecipe.id = result.id;

            if (action === 'add')
                dispatch(addRecipe(currentRecipe));
            else {
                dispatch(updateRecipe(currentRecipe));
            }

            setMode("list");
            disableUpperPanel(false);
        }
        else {
            alert(result.message);
        }
        loaderOff();
    }

    const printRecipe = async (r: recipeType) => {
        let text = '';

        if (r.ingredients || r.preparation || r.comments) {
            text += `
                <div style="direction:rtl">
                    <h1>${r.name}</h1>
            `;

            if (r.ingredients) {
                text += `
                    <h3>רכיבים</h3>
                    <div>${r.ingredients}</div>
                `;
            }

            if (r.preparation) {
                text += `
                    <h3>אופן ההכנה</h3>
                    <div>${r.preparation}</div>
                `;
            }

            if (r.comments) {
                text += `
                    <h3>הערות</h3>
                    <div>${r.comments}</div>
                `;
            }

            text += '</div>'
        }

        if (r.image) {
            text += `<img src="${imageUrl(r.image)}" />`;
        }

        const htmlText = text.replace(/\n/g, "<br>");

        const printWindow: Window | null = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`<div>${htmlText}</div>`);
            printWindow.document.close();

            if (r.image) {
                printWindow.onload = () => {
                    printWindow.print();
                    printWindow.close();
                };
            }
            else {
                printWindow.print();
                printWindow.close();
            }
        }
    }

    const removeRecipeConfirmation = async (id: number) => {
        confirmData.current = {
            msg: 'למחוק את המתכון?',
            yesHandler: () => { removeRecipe(id) },
        };

        setOpenConfirmModal(true);
    }

    const removeRecipe = async (id: number) => {
        loaderOn();

        const result: any = await api.deleteRecipe(id);

        if (result.success) {
            dispatch(deleteRecipe({ id }));
        }
        else {
            alert(result.message);
        }

        loaderOff();
    }

    const zoomImage = (r: recipeType) => {
        setMode('zoom');
        setZoomImageUrl(r.image ?? '');
    }

    const zoomImageClick = () => {
        setMode('edit');
    }

    const backFromRecipe = () => {
        setLocation(`/recipes?c=${filterCategoryId}`, { replace: false })
        setMode('list');
        disableUpperPanel(false);
    }

    useEffect(() => {
        filterRecipesByCategory();
    }, [allRecipes, filterCategoryId])

    useEffect(() => {
        setViewRecipes(filterRecipes);
    }, [filterRecipes])

    useEffect(() => {
        const filteredRecipes: Array<recipeType> = filterRecipes.filter((r: recipeType) => (r.name.includes(searchRecipes)));

        setViewRecipes(filteredRecipes);
    }, [searchRecipes])

    useEffect(() => {
        if (startRecipe.current > 0) {
            const openRecipe: Array<recipeType> = viewRecipes.filter((r: recipeType) => r.id === startRecipe.current);

            if (openRecipe.length > 0) {
                editRecipe(openRecipe[0]);
                startRecipe.current = -1;
            }
        }
        else {
            if (viewRecipes.length > 0)
                loaderOff();
        }
    }, [viewRecipes])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const catId: any = params.get("c");

        if (catId) {
            // TODO: fix in both situations reload/from categories
            // loaderOn();

            startCategory.current = parseInt(catId);
            setFilterCategoryId(parseInt(catId));

            const recipeId: any = params.get("r");
            startRecipe.current = recipeId ? parseInt(recipeId) : -1;
        }

        if ((startCategory.current === -1) && (startRecipe.current === -1))
            loaderOff();
    }, [])

    return (
        <div className='page'>
            <NavBar current={'recipes'} />

            <div className='content'>
                <div className='page-content'>
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

                    <div className='upper-panel'>
                        <Section>
                            <div className={`actions ${deviceType}`}>
                                <div className={`action-panel ${deviceType}`}>
                                    <div className={`action-title ${deviceType}`}>קטגוריה</div>
                                    <select
                                        onChange={e => categoryFilterChanged(e)}
                                        disabled={disableFilters}
                                        value={filterCategoryId}
                                    >
                                        {
                                            allCategories.map((c: categoryType) => {
                                                return (
                                                    <option 
                                                        disabled={[-1, filterCategoryId].includes(c.id)}
                                                        key={c.id} 
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div>
                                        {
                                            `( ${viewRecipes.length} )`
                                        }
                                    </div>
                                </div>

                                <div className={`action-panel ${deviceType}`}>
                                    <div className={`action-title ${deviceType}`}>חיפוש</div>
                                    <input
                                        value={searchRecipes}
                                        onChange={(e) => searchChanged(e)}
                                        disabled={disableFilters}
                                    />
                                </div>
                            </div>
                        </Section>
                    </div>

                    <div className='recipes-area'>
                        <Section>
                            {
                                mode === 'zoom' &&
                                <div className='zoom-area'>
                                    <img className="zoomImg" src={`${imageUrl(zoomImageUrl)}`} onClick={() => zoomImageClick()} />
                                </div>
                            }
                            {
                                mode === 'list' &&
                                <div className='recipes-list'>
                                    {
                                        filterCategoryId > 0 &&
                                        <div className={`recipe-item add-item ${deviceType}`} onClick={newRecipe}>
                                            <div>הוספת מתכון</div>
                                        </div>
                                    }

                                    {
                                        viewRecipes.map((r: recipeType) => (
                                            <div key={r.id} className='recipe-row'>
                                                <div
                                                    key={r.id}
                                                    className={`recipe-item ${deviceType}`}
                                                    onClick={(() => { editRecipe(r) })}
                                                >
                                                    {r.name}
                                                </div>
                                                {/* <div className='font-icon' onClick={() => { removeRecipe(r.id) }}> */}
                                                <div className='font-icon' onClick={() => { removeRecipeConfirmation(r.id) }}>
                                                    <i className="fa fa-trash"></i>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }

                            {
                                mode === 'edit' &&
                                <div className='edit-form'>
                                    <form>
                                        <div className={`form-data ${deviceType}`}>
                                            <div className={`new-element ${deviceType}`}>
                                                <label htmlFor="name">שם המתכון</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    value={currentRecipe.name}
                                                    onChange={(e) => { updateCurrentRecipeData(e, "name"); }}
                                                />
                                                {/* <input
                                            id="image"
                                            type="text"
                                            value={currentRecipe.image}
                                            onChange={(e) => { updateCurrentRecipeData(e, "image"); }}
                                        /> */}
                                                <div className='recipe-img'>
                                                    {
                                                        currentRecipe.image &&
                                                        <img src={`${imageUrl(currentRecipe.image)}`} onClick={() => zoomImage(currentRecipe)} />
                                                    }
                                                </div>
                                            </div>

                                            <div className={`new-element ${deviceType}`}>
                                                <label htmlFor="ingredients">רכיבים</label>
                                                <textarea
                                                    id="ingredients"
                                                    className={`${deviceType}`}
                                                    value={currentRecipe.ingredients}
                                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { updateCurrentRecipeData(e, "ingredients"); }}
                                                />
                                            </div>

                                            <div className={`new-element ${deviceType}`}>
                                                <label htmlFor="preparation">אופן ההכנה</label>
                                                <textarea
                                                    id="preparation"
                                                    className={`${deviceType}`}
                                                    value={currentRecipe.preparation}
                                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { updateCurrentRecipeData(e, "preparation"); }}
                                                />
                                            </div>

                                            <div className={`new-element ${deviceType}`}>
                                                <label htmlFor="comments">הערות</label>
                                                <textarea
                                                    id="comments"
                                                    className={`${deviceType}`}
                                                    value={currentRecipe.comments || ''}
                                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { updateCurrentRecipeData(e, "comments"); }}
                                                />
                                            </div>
                                        </div>

                                        <div className='new-panel'>
                                            <div className='font-icon' onClick={(e: any) => saveRecipe(e)}>
                                                <i className="fa fa-save"></i>
                                            </div>
                                            {
                                                deviceType === "desktop" &&
                                                <div className='font-icon' onClick={() => printRecipe(currentRecipe)}>
                                                    <i className="fa fa-print"></i>
                                                </div>
                                            }
                                            <div className='font-icon' onClick={() => { backFromRecipe() }}>
                                                <i className="fa fa-arrow-left"></i>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            }
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipesPage;
