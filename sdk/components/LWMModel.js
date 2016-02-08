/**
 * LWMModel component.
 * Author: Patryk 'PsichiX' Budzyński.
 * Last update: 2015-09-26.
 */

pc.script.attribute('url','string','',{
   displayName: 'LWM model URL' 
});

pc.script.attribute('materialsMapping', 'asset', [], {
    displayName: 'Materials mapping config',
    type: 'json',
    max: 1
});

pc.script.create('LWMModel', function (app) {
    
    function LWMModel(entity){
        
        this.entity = entity;
        
    }
    
    LWMModel.prototype = Object.create(null);
    
    LWMModel.prototype.entity = null;
    LWMModel.prototype.url = null;
    LWMModel.prototype.materialsMapping = null;
    
    LWMModel.prototype._asset = null;
    
    LWMModel.prototype.initialize = function(){
        
        this.updateAsset();
        
    };
    
    LWMModel.prototype.update = function(dt){
    };
    
    LWMModel.prototype.onAttributeChange = function(name, oldValue, newValue){
        
        if(name === 'url' || name === 'materialsMapping'){
            this.updateAsset();
        }
        
    };
    
    LWMModel.prototype.updateAsset = function(url){
        
        url = url || this.url;
        var entity = this.entity,
            modelComponent = entity.model,
            asset = app.assets.getByUrl(url),
            uri;
        
        if(!asset){
            uri = new pc.URI(url);
            if(pc.path.getExtension(uri.path) !== '.lwm'){
                console.error('LWMModel::updateAsset | trying to load file other than .lwm!');
            } else {
                app.assets.loadFromUrl(url, 'lwmmodel', function(err, asset){
                    if(err){
                        this._asset = null;
                        console.error('LWMModel::updateAsset::success | ' + err);
                    } else {
                        this.fire('lwm.model:loaded', asset);
                        if(modelComponent){
                            this._asset = asset;
                            modelComponent.model = asset.resource;
                            this.applyMaterials(modelComponent.model);
                            this.fire('lwm.model:changed', asset);
                        }
                    }
                }.bind(this));
            }
        } else {
            asset.ready(function(asset){
                if(modelComponent){
                    modelComponent.model = asset.resource;
                    this.applyMaterials(modelComponent.model);
                    this.fire('lwm.model:changed', asset);
                }
            }.bind(this));
        }
        
    };
    
    LWMModel.prototype.applyMaterials = function(model){
        
        var meshInstances = model.meshInstances,
            configAsset = app.assets.get(this.materialsMapping),
            config,
            cmi, cm, min, mn, ma, i, c, j;
        
        if(meshInstances && configAsset){
            configAsset.ready(function(asset){
                config = asset.resource;
                cmi = config.meshInstancesMapping;
                cm = config.materialsMapping;
                if(cm && Array.isArray(cm)){
                    for(i = 0, c = Math.min(meshInstances.length, cm.length); i < c; ++i){
                        mn = cm[i];
                        ma = typeof mn === 'string' ? app.assets.find(mn) : app.assets.get(mn);
                        ma.ready(function(asset){
                            meshInstances[i].material = ma.resource;
                            meshInstances[i].material.update();
                        }.bind(this));
                        app.assets.load(ma);
                    }
                }
                else if(cmi && cm){
                    for(var key in cmi){
                        if(cmi.hasOwnProperty(key) && cm.hasOwnProperty(key)){
                            min = cmi[key];
                            mn = cm[key];
                            ma = typeof mn === 'string' ? app.assets.find(mn) : app.assets.get(mn);
                            for(i = 0, c = min.length; i < c; ++i){
                                j = min[i];
                                if(j < meshInstances.length){
                                    ma.ready(function(asset){
                                        meshInstances[j].material = ma.resource;
                                        meshInstances[j].material.update();
                                    }.bind(this));
                                    app.assets.load(ma);
                                }
                            }
                        }
                    }
                }
            }.bind(this));
            app.assets.load(configAsset);
        }
        
    };
    
    return LWMModel;
    
});
