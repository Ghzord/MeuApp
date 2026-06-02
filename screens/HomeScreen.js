import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform, ActivityIndicator, Modal, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');

    // Dados do usuário
    const [address, setAddress] = useState('Rua dos Burgers, 123 - Urso Ville');
    const [userName, setUserName] = useState('Cliente Urso');
    const [userEmail, setUserEmail] = useState('');
    const [loadingUser, setLoadingUser] = useState(true);

    // Controle de modais e sacola
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isAboutVisible, setIsAboutVisible] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const loggedEmail = await AsyncStorage.getItem('@user_email');
                if (loggedEmail) {
                    setUserEmail(loggedEmail);
                    const userKey = `user:${loggedEmail.toLowerCase().trim()}`;
                    
                    const response = await fetch(`https://relieved-rattler-139617.upstash.io/get/${userKey}`, {
                        headers: {
                            Authorization: 'Bearer gQAAAAAAAiFhAAIgcDJhNDY1ZGIxMTJkMjI0ODU1YmQ1OTI0NzU2Njc5ZmU3MA=='
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data && data.result) {
                        const userData = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;

                        if (userData?.address) setAddress(userData.address);
                        if (userData?.name) setUserName(userData.name);
                    } else {
                        setAddress('Usuário não encontrado');
                    }
                } else {
                    setAddress('Faça login para ver o endereço');
                }
            } catch (err) {
                console.log("Erro na busca de dados locais/remotos:", err);
                setAddress('Erro ao carregar dados 🌐');
            } finally {
                setLoadingUser(false);
            }
        }
        fetchUser();
    }, []);

    const categories = [
        { id: '1', name: 'Todos', icon: 'restaurant-outline' },
        { id: '2', name: 'Burgers', icon: 'fast-food-outline' },
        { id: '3', name: 'Combos', icon: 'gift-outline' },
        { id: '4', name: 'Bebidas', icon: 'beer-outline' },
        { id: '5', name: 'Sobremesas', icon: 'ice-cream-outline' },
    ];

    const products = [
        // --- BURGERS ---
        {
            id: '1',
            name: 'Cheddar Supremo',
            category: 'Burgers',
            price: 'R$ 30,00',
            numericPrice: 30.00,
            description: 'Pão brioche macio, hambúrguer artesanal suculento, muito cheddar cremoso e cebola caramelizada para um sabor intenso e irresistível.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        {
            id: '2',
            name: 'Frango Crocante',
            category: 'Burgers',
            price: 'R$ 25,00',
            numericPrice: 25.00,
            description: 'Filé de frango empanado super crocante, alface fresquinha, molho especial da casa e pão levinho que combina perfeitamente.',
            image: 'https://tse2.mm.bing.net/th/id/OIP.NseFW3cwjF5bKuye3OnymgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
        },
        {
            id: '3',
            name: 'Clássico Urso',
            category: 'Burgers',
            price: 'R$ 22,00',
            numericPrice: 22.00,
            description: 'O hambúrguer tradicional que nunca decepciona: carne artesanal, queijo derretido, alface, tomate e molho especial no pão macio.',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: '4',
            name: 'X-Salada',
            category: 'Burgers',
            price: 'R$ 20,00',
            numericPrice: 20.00,
            description: 'Hambúrguer grelhado, queijo, alface crocante e tomate fresquinho, trazendo o equilíbrio perfeito entre sabor e leveza.',
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: '5',
            name: 'Batata Frita Tradicional',
            category: 'Burgers',
            price: 'R$ 10,00',
            numericPrice: 10.00,
            description: 'Porção individual de batatas fritas palito, crocantes por fora e macias por dentro.',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: '6',
            name: 'Batata Rústica do Urso',
            category: 'Burgers',
            price: 'R$ 15,00',
            numericPrice: 15.00,
            description: 'Porção de batatas rústicas com corte especial, temperadas com páprica e alecrim.',
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        {
            id: '7',
            name: 'Mandioquinha Frita',
            category: 'Burgers',
            price: 'R$ 10,00',
            numericPrice: 10.00,
            description: 'Porção de mandioquinha frita bem crocante e sequinha, ideal para acompanhar seu lanche.',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: '8',
            name: 'Polenta Frita Crocante',
            category: 'Burgers',
            price: 'R$ 15,00',
            numericPrice: 15.00,
            description: 'Porção de polenta frita em palitos, dourada por fora e super cremosa por dentro.',
            image: 'https://th.bing.com/th/id/OIP.lZhOZZKKI4QYXsKPPWaSlwHaFD?w=237&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
        },

        // --- COMBOS ---
        {
            id: '9',
            name: 'Combo Urso Smash',
            category: 'Combos',
            price: 'R$ 44,90',
            numericPrice: 44.90,
            description: '1 Urso Smash Burger + Batata Frita Individual + 1 Refrigerante em lata.',
            image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        {
            id: '10',
            name: 'Combo Supremo Duplo',
            category: 'Combos',
            price: 'R$ 49,00',
            numericPrice: 49.00,
            description: '1 Cheddar Supremo + 1 Porção de Batata Rústica + 1 Coca-Cola em lata trincando.',
            image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: '11',
            name: 'Combo Casal Urso',
            category: 'Combos',
            price: 'R$ 79,90',
            numericPrice: 79.90,
            description: '2 Burgers Clássicos + 1 Porção Grande de Fritas + 2 Refrigerantes em lata à escolha.',
            image: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=500&auto=format&fit=crop&q=60',
        },

        // --- BEBIDAS ---
        {
            id: '12',
            name: 'Coca-Cola Lata',
            category: 'Bebidas',
            price: 'R$ 6,00',
            numericPrice: 6.00,
            description: 'Lata 350ml trincando de gelada.',
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        {
            id: '13',
            name: 'Guaraná Antarctica Lata',
            category: 'Bebidas',
            price: 'R$ 6,00',
            numericPrice: 6.00,
            description: 'O autêntico sabor do guaraná em lata de 350ml super gelada.',
            image: 'https://uploads.metropoles.com/wp-content/uploads/2021/10/14145313/Guarana-Antartica.jpg',       
        },
        {
            id: '14',
            name: 'Suco de Laranja Natural',
            category: 'Bebidas',
            price: 'R$ 8,50',
            numericPrice: 8.50,
            description: 'Suco natural da fruta feito na hora, sem conservantes. Garrafa 400ml.',
            image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=60',
        },

        // --- SOBREMESAS ---
        {
            id: '15',
            name: 'Brownie do Urso com Sorvete',
            category: 'Sobremesas',
            price: 'R$ 16,00',
            numericPrice: 16.00,
            description: 'Brownie de chocolate meio amargo quentinho servido com uma bola de sorvete de creme e calda de chocolate.',
            image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: '16',
            name: 'Milkshake de Ovomaltine',
            category: 'Sobremesas',
            price: 'R$ 18,00',
            numericPrice: 18.00,
            description: 'Milkshake ultra cremoso de 400ml feito com sorvete premium e muito Ovomaltine crocante.',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60',
        }
    ];

    const handleAddToCart = (product) => {
        setCart((currentCart) => {
            const hasItem = currentCart.find(item => item.id === product.id);
            if (hasItem) {
                return currentCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, change) => {
        setCart((currentCart) => {
            return currentCart.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + change;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean);
        });
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('@user_email');
        setIsProfileVisible(false);
        navigation.navigate('Login');
    };

    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPriceInCart = cart.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
        const cleanSearch = search.trim().toLowerCase();
        return matchesCategory && (product.name.toLowerCase().includes(cleanSearch) || product.description.toLowerCase().includes(cleanSearch));
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            
            {/* Header / Topo */}
            <View style={styles.header}>
                <View style={styles.deliveryContainer}>
                    <Text style={styles.deliveryTitle}>ENTREGAR EM</Text>
                    <View style={styles.locationRow}>
                        {loadingUser ? (
                            <ActivityIndicator size="small" color="#ff6600" style={{ marginRight: 5 }} />
                        ) : (
                            <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
                        )}
                    
                    </View>
                </View>

                <View style={styles.headerButtonsRow}>
                    <TouchableOpacity style={styles.cartButton} onPress={() => setIsCartVisible(true)}>
                        <Ionicons name="cart-outline" size={26} color="#222" />
                        {totalItemsInCart > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{totalItemsInCart}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileButton} onPress={() => setIsProfileVisible(true)}>
                        <Ionicons name="person-circle-outline" size={28} color="#222" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContainer}>
                
                {/* Busca */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar pratos ou bebidas..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#999"
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#bbb" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Banner Promocional */}
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80' }} style={styles.bannerImage} />
                    <View style={styles.bannerOverlay}>
                        <View style={styles.bannerBadge}><Text style={{color: '#fff', fontSize: 10, fontWeight: 'bold'}}>CUPOM: URSO10</Text></View>
                        <Text style={styles.bannerTitle}>10% OFF no seu primeiro Urso Burger</Text>
                    </View>
                </View>

                {/* Categorias Horizontal */}
                <Text style={styles.sectionTitle}>Categorias</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer} style={styles.horizontalScrollStyle}>
                    {categories.map((cat) => (
                        <TouchableOpacity key={cat.id} style={[styles.categoryCard, activeCategory === cat.name && styles.activeCategoryCard]} onPress={() => setActiveCategory(cat.name)}>
                            <Ionicons name={cat.icon} size={18} color={activeCategory === cat.name ? '#fff' : '#ff6600'} />
                            <Text style={[styles.categoryText, activeCategory === cat.name && styles.activeCategoryText]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Lista de Produtos */}
                <Text style={styles.sectionTitle}>{activeCategory === 'Todos' ? 'Mais vendidos' : activeCategory}</Text>
                <View style={styles.productsListContainer}>
                    {filteredProducts.map((item) => {
                        const cartItem = cart.find(c => c.id === item.id);
                        const itemQuantity = cartItem ? cartItem.quantity : 0;

                        return (
                            <View key={item.id} style={styles.productCard}>
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productDescription} numberOfLines={3}>{item.description}</Text>
                                    <Text style={styles.productPrice}>{item.price}</Text>
                                </View>
                                <View style={styles.productImageContainer}>
                                    <Image source={{ uri: item.image }} style={styles.productImage} />
                                    <TouchableOpacity style={[styles.addButton, itemQuantity > 0 && styles.addedButton]} onPress={() => handleAddToCart(item)}>
                                        <Text style={[styles.addButtonText, itemQuantity > 0 && styles.addedButtonText]}>
                                            {itemQuantity > 0 ? `Adicionado (${itemQuantity})` : 'Adicionar'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* MODAL: SACARRINHO */}
            <Modal visible={isCartVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCartVisible(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setIsCartVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalDragIndicator} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Minha Sacola</Text>
                            <TouchableOpacity onPress={() => setIsCartVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        {cart.length === 0 ? (
                            <View style={styles.emptyCartContainer}>
                                <Ionicons name="cart-outline" size={60} color="#ccc" />
                                <Text style={styles.emptyCartText}>Sua sacola está vazia</Text>
                            </View>
                        ) : (
                            <>
                                <ScrollView style={styles.cartItemsScroll}>
                                    {cart.map((item) => (
                                        <View key={item.id} style={styles.cartItemCard}>
                                            <View style={styles.cartItemInfo}>
                                                <Text style={styles.cartItemName}>{item.name}</Text>
                                                <Text style={styles.cartItemPrice}>R$ {(item.numericPrice * item.quantity).toFixed(2).replace('.', ',')}</Text>
                                            </View>
                                            <View style={styles.quantityControls}>
                                                <TouchableOpacity style={styles.controlBtn} onPress={() => updateQuantity(item.id, -1)}>
                                                    <Ionicons name={item.quantity === 1 ? "trash-outline" : "remove"} size={16} color="#ff6600" />
                                                </TouchableOpacity>
                                                <Text style={styles.controlText}>{item.quantity}</Text>
                                                <TouchableOpacity style={styles.controlBtn} onPress={() => updateQuantity(item.id, 1)}>
                                                    <Ionicons name="add" size={16} color="#ff6600" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                                <View style={styles.cartFooter}>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <Text style={styles.totalValue}>R$ {totalPriceInCart.toFixed(2).replace('.', ',')}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.checkoutButton} onPress={() => alert('Pedido enviado para a cozinha! 🐻🔥')}>
                                        <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            {/* MODAL: PERFIL */}
            <Modal visible={isProfileVisible} animationType="slide" transparent={true} onRequestClose={() => setIsProfileVisible(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setIsProfileVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalDragIndicator} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Meu Perfil</Text>
                            <TouchableOpacity onPress={() => setIsProfileVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileInfoContainer}>
                            <View style={styles.profileAvatarLarge}>
                                <Text style={styles.profileAvatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
                            </View>
                            <Text style={styles.profileWelcomeText}>Olá, {userName}!</Text>
                            <Text style={styles.profileEmailText}>{userEmail || 'email@provedor.com'}</Text>
                        </View>

                        <View style={styles.profileDetailsBox}>
                            <View style={styles.profileDetailRow}>
                                <Ionicons name="location-outline" size={20} color="#ff6600" style={{ marginRight: 10 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.profileDetailLabel}>Endereço Cadastrado</Text>
                                    <Text style={styles.profileDetailValue}>{address}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.aboutMenuRow}
                            onPress={() => {
                                setIsProfileVisible(false);
                                setTimeout(() => setIsAboutVisible(true), 400);
                            }}
                        >
                            <View style={styles.aboutMenuLeft}>
                                <Ionicons name="information-circle-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                                <Text style={styles.aboutMenuText}>Sobre o App</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#aaa" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#c62828" style={{ marginRight: 8 }} />
                            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* MODAL: SOBRE O APP */}
            <Modal visible={isAboutVisible} animationType="slide" transparent={true} onRequestClose={() => setIsAboutVisible(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setIsAboutVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalDragIndicator} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sobre o App</Text>
                            <TouchableOpacity onPress={() => setIsAboutVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ marginBottom: 10 }} showsVerticalScrollIndicator={false}>
                            <View style={styles.aboutLogoContainer}>
                                <Text style={styles.aboutAppName}>Urso Burgers</Text>
                                <Text style={styles.aboutAppVersion}>Versão 1.0.0 (2026)</Text>
                            </View>

                            <Text style={styles.aboutParagraph}>
                                O <Text style={{ fontWeight: 'bold' }}>Urso Burgers</Text> é o seu app de delivery definitivo criado para matar a sua fome com os lanches mais brutos e monstruosos da região!
                            </Text>
                            <Text style={styles.aboutParagraph}>
                                Desenvolvido utilizando as tecnologias mais modernas de desenvolvimento mobile, combinando a alta performance do <Text style={{ fontWeight: 'bold', color: '#05a5d1' }}>React Native / Expo</Text> com o armazenamento em tempo real ultraveloz em nuvem do <Text style={{ fontWeight: 'bold', color: '#00e599' }}>Upstash DB</Text>.
                            </Text>

                            <View style={styles.aboutDivider} />

                            <Text style={styles.aboutCreditsTitle}>Créditos</Text>
                            <Text style={styles.aboutCreditsText}>Criadores</Text>
                            <Text style={styles.aboutCreditsText}>• Guilherme Ortega</Text>
                            <Text style={styles.aboutCreditsText}>• Marcelo Vilar</Text>
                            <Text style={styles.aboutCreditsText}>• Sophia Batista</Text>
                            <Text style={styles.aboutCreditsText}>• Nicolas Augusto</Text>
                        </ScrollView>

                        <TouchableOpacity style={styles.checkoutButton} onPress={() => setIsAboutVisible(false)}>
                            <Text style={styles.checkoutButtonText}>Voltar ao Cardápio</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff', ...Platform.select({ web: { overflowY: 'auto', height: '100vh' } }) },
    scrollContainer: { flexGrow: 1, paddingBottom: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f5f5f5' },
    deliveryContainer: { flex: 1, marginRight: 10 },
    deliveryTitle: { fontSize: 10, color: '#999', fontWeight: '700', letterSpacing: 0.8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    locationText: { fontSize: 14, fontWeight: 'bold', color: '#333', marginRight: 4, flex: 1 },
    headerButtonsRow: { flexDirection: 'row', alignItems: 'center' },
    cartButton: { padding: 6, position: 'relative', marginRight: 8 },
    profileButton: { padding: 4 },
    cartBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#ff6600', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f4f4', marginHorizontal: 20, marginTop: 15, borderRadius: 12, paddingHorizontal: 15, height: 46 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 8 },
    bannerContainer: { marginHorizontal: 20, marginTop: 20, borderRadius: 15, overflow: 'hidden', height: 130, position: 'relative' },
    bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', paddingHorizontal: 20 },
    bannerBadge: { backgroundColor: '#ff6600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 6 },
    bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginLeft: 20, marginTop: 25, marginBottom: 12 },
    horizontalScrollStyle: { flexGrow: 0 },
    categoriesContainer: { paddingHorizontal: 15, paddingBottom: 5 },
    categoryCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 5, alignItems: 'center', flexDirection: 'row', height: 40 },
    activeCategoryCard: { backgroundColor: '#ff6600', borderColor: '#ff6600' },
    categoryText: { fontSize: 13, fontWeight: '600', color: '#555', marginLeft: 6 },
    activeCategoryText: { color: '#fff' },
    productsListContainer: { marginTop: 5 },
    productCard: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    productDetails: { flex: 1, paddingRight: 15 },
    productName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    productDescription: { fontSize: 13, color: '#777', lineHeight: 18, marginBottom: 8 },
    productPrice: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32', marginTop: 2 },
    productImageContainer: { alignItems: 'center', justifyContent: 'flex-start', width: 95 },
    productImage: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#f4f4f4' },
    addButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginTop: -12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 3, width: '100%', alignItems: 'center' },
    addButtonText: { color: '#ff6600', fontWeight: 'bold', fontSize: 11 },
    addedButton: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
    addedButtonText: { color: '#fff' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 35 : 25, maxHeight: '75%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 10 },
    modalDragIndicator: { width: 40, height: 5, backgroundColor: '#e0e0e0', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
    cartItemsScroll: { marginBottom: 15 },
    cartItemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    cartItemInfo: { flex: 1, paddingRight: 10 },
    cartItemName: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
    cartItemPrice: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
    quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, padding: 4 },
    controlBtn: { paddingHorizontal: 10, paddingVertical: 5 },
    controlText: { fontSize: 14, fontWeight: 'bold', color: '#333', paddingHorizontal: 4 },
    cartFooter: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalLabel: { fontSize: 16, fontWeight: '500', color: '#666' },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: '#222' },
    checkoutButton: { backgroundColor: '#ff6600', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center' },
    checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    emptyCartContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    emptyCartText: { fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 10 },
    profileInfoContainer: { alignItems: 'center', marginVertical: 15 },
    profileAvatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#ffe6d5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    profileAvatarLetter: { fontSize: 32, fontWeight: 'bold', color: '#ff6600' },
    profileWelcomeText: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 4 },
    profileEmailText: { fontSize: 14, color: '#777' },
    profileDetailsBox: { backgroundColor: '#f9f9f9', borderRadius: 14, padding: 15, marginTop: 10, marginBottom: 15 },
    profileDetailRow: { flexDirection: 'row', alignItems: 'center' },
    profileDetailLabel: { fontSize: 11, color: '#999', fontWeight: 'bold', textTransform: 'uppercase' },
    profileDetailValue: { fontSize: 14, color: '#444', marginTop: 2, fontWeight: '500' },
    aboutMenuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0', marginBottom: 25 },
    aboutMenuLeft: { flexDirection: 'row', alignItems: 'center' },
    aboutMenuText: { fontSize: 15, color: '#444', fontWeight: '500' },
    logoutButton: { flexDirection: 'row', backgroundColor: '#ffebee', borderWidth: 1, borderColor: '#ffcdd2', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center' },
    logoutButtonText: { color: '#c62828', fontSize: 15, fontWeight: 'bold' },
    aboutLogoContainer: { alignItems: 'center', marginVertical: 20 },
    aboutAppName: { fontSize: 22, fontWeight: 'bold', color: '#222' },
    aboutAppVersion: { fontSize: 13, color: '#999', marginTop: 2 },
    aboutParagraph: { fontSize: 14, color: '#555', lineHeight: 22, textAlign: 'center', marginBottom: 15, paddingHorizontal: 10 },
    aboutDivider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    aboutCreditsTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    aboutCreditsText: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 4 }
});